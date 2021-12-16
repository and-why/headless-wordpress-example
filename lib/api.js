const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getPreviewPost(id, idType = 'DATABASE_ID') {
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.post;
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getAllPrimaryNavigation(preview) {
  const data = fetchAPI(
    `
    query NavPrimary {
      menus {
        edges {
          node {
            id
            name
            menuItems {
              edges {
                node {
                  path
                  id
                  label
                }
              }
            }
          }
        }
      }
    }
    `,
  );
}

export async function getAllPages(preview) {
  const data = await fetchAPI(
    `
    query AllPages {
      pages {
        edges {
          node {
            isFrontPage
            slug
            title
            homepage {
              pageSubtitle
              pageTitle
              ctaButtons {
                button {
                  target
                  title
                  url
                }
                fieldGroupName
              }
              fieldGroupName
              faqSection {
                faqTabGroup {
                  fieldGroupName
                  faqAccordion {
                    description
                    fieldGroupName
                    title
                  }
                  tabTitle
                }
                faqTitle
                fieldGroupName
              }
              multiAxisSlider {
                fieldGroupName
                tabGroup {
                  fieldGroupName
                  slide {
                    fieldGroupName
                    slideCta {
                      target
                      title
                      url
                    }
                    slideDescription
                    slideImage {
                      altText
                      mediaItemUrl
                      mediaDetails {
                        height
                        width
                      }
                    }
                    slideTitle
                  }
                  tabTitle
                }
              }
              pageImage {
                altText
                mediaItemUrl
                mediaDetails {
                  height
                  width
                }
              }
              sliderSection {
                fieldGroupName
                slide {
                  fieldGroupName
                  slideBgColor
                  slideCta {
                    target
                    title
                    url
                  }
                  slideDescription
                  slideTitle
                }
                sliderTitle
              }
              testimonialSection {
                fieldGroupName
                testimonial {
                  fieldGroupName
                  image {
                    altText
                    mediaItemUrl
                    mediaDetails {
                      height
                      width
                    }
                  }
                  jobTitle
                  name
                  testimonialCopy
                }
                testimonialTitle
              }
              largeCtaBox {
                button {
                  target
                  url
                }
                fieldGroupName
                title
              }
            }
          }
        }
      }
    }
    
    
    
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    },
  );

  return data?.pages;
}

export async function getPostAndMorePosts(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId ? Number(slug) === postPreview.id : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === 'draft';
  const isRevision = isSamePost && postPreview?.status === 'publish';
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ''
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? 'DATABASE_ID' : 'SLUG',
      },
    },
  );

  // Draft posts may not have a slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
}
