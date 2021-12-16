import Image from 'next/image';
import Head from 'next/head';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import Intro from '../components/intro';
import Layout from '../components/layout';
import { getAllPages, getAllPostsForHome } from '../lib/api';
import { CMS_NAME } from '../lib/constants';
import PostBody from '../components/post-body';
import HomepageHeader from '../components/homepage-header';
import ContentSlider from '../components/content-slider';
import MultiAxisSlider from '../components/multi-axis-slider';

export default function Index({ allPages: { edges }, preview }) {
  const morePages = edges;
  const homepage = morePages.find((item) => item.node.isFrontPage);
  const page = homepage.node.homepage;
  console.log(page);

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>
            {page.pageTitle} {CMS_NAME}
          </title>
        </Head>
        <HomepageHeader
          pageTitle={page.pageTitle}
          pageSubtitle={page.pageSubtitle}
          ctaButtons={page.ctaButtons}
        />
        <Container>
          <div className="bg-[url('/images/background-hero.png')]">
            <div className='mx-auto text-center max-w-xl shadow-2xl rounded-2xl mb-20 align-middle leading-0 before:'>
              <Image
                height={page.pageImage.mediaDetails.height}
                width={page.pageImage.mediaDetails.width}
                src={page.pageImage.mediaItemUrl}
                objectFit='cover'
                alt={page.pageImage.altText || `${page.pageTitle} image`}
                className='rounded-2xl align-bottom block'
              />
            </div>
          </div>
          <ContentSlider slider={page.sliderSection} />
          <MultiAxisSlider content={page.multiAxisSlider} />
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps({ preview = false }) {
  const allPages = await getAllPages(preview);
  return {
    props: { allPages, preview },
  };
}
