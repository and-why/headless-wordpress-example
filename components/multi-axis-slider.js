import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styled, { css } from 'styled-components';

export default function MultiAxisSlider({ content }) {
  console.log(content);
  const [tabActive, setTabActive] = useState(0);
  const [slideActive, setSlideActive] = useState(0);

  return (
    <MultiAxisSliderSection>
      <>
        <h2>{content.title}</h2>
        <TabButtons>
          {content.tabGroup.map((tabGroup, index) => {
            return (
              <TabButton active={tabActive === index} onClick={() => setTabActive(index)}>
                {tabGroup.tabTitle}
              </TabButton>
            );
          })}
        </TabButtons>
        <TabGroupContainer>
          {content.tabGroup.map((tabGroup, index) => {
            return (
              <TabGroup active={tabActive === index}>
                <SlideButtons>
                  {tabGroup.slide.map((slide, index) => {
                    return (
                      <SlideButton
                        active={slideActive === index}
                        onClick={() => setSlideActive(index)}
                      >
                        <span>{index < 9 ? 0 + (index + 1).toString() : index + 1}</span>{' '}
                        {slide.slideTitle}
                      </SlideButton>
                    );
                  })}
                </SlideButtons>
                {tabGroup.slide.map((slide, index) => {
                  if (slideActive === index) {
                    return (
                      <Slide>
                        {slide.slideImage && (
                          <Image
                            height={slide.slideImage.mediaDetails.height}
                            width={slide.slideImage.mediaDetails.width}
                            src={slide.slideImage.mediaItemUrl}
                          />
                        )}
                        <h3>{slide.slideTitle}</h3>
                        <p>{slide.slideDescription}</p>
                        {slide.slideCta && (
                          <Link href={slide.slideCta.url}>
                            <a>{slide.slideCta.title}</a>
                          </Link>
                        )}
                      </Slide>
                    );
                  }
                })}
              </TabGroup>
            );
          })}
        </TabGroupContainer>
      </>
    </MultiAxisSliderSection>
  );
}

const MultiAxisSliderSection = styled.section`
  width: 100%;
  display: flex;
  align-items: flex-start;
  position: relative;
  flex-direction: column;
  margin: 64px 0;
  transition: all 0.3s ease;
  h2 {
    font-size: 48px;
    line-height: 1.1;
    margin-bottom: 32px;
    color: #2f446f;
    font-weight: 600;
    max-width: 500px;
    text-align: center;
  }
`;

const TabGroupContainer = styled.div`
  position: relative;
  display: grid;
  width: 100%;
`;
const TabGroup = styled.div`
  display: flex;
  padding: 32px 0;
  opacity: 0;
  grid-area: 1 / 1 / 2 / 2;
  visibility: hidden;
  transition: all 0.3s ease;
  ${(props) =>
    props.active &&
    css`
      visibility: visible;
      height: auto;
      transition: all 0.3s ease;
      opacity: 1;
    `}
`;
const TabButtons = styled.button`
  display: flex;
  column-gap: 8px;
`;
const TabButton = styled.button`
  display: flex;
  padding: 16px 32px;
  color: #666;
  border-radius: 8px;
  &:hover {
    background: #eff3ff;
    color: #3f7dfe;
  }
  ${(props) =>
    props.active &&
    css`
      background: #eff3ff;
      color: #3f7dfe;
    `}
`;

const SlideButtons = styled.div`
  display: flex;
  min-width: 250px;
  row-gap: 8px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  transition: all 0.3s ease;
`;
const SlideButton = styled.button`
  padding: 16px;
  font-weight: 600;
  border-radius: 0 8px 8px 0;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  transition: all 0.3s ease;
  border-left: 3px solid white;
  span {
    margin-right: 16px;
  }
  &:hover {
    border-left: 3px solid #3f7dfe;
    background: #eff3ff;
    color: #333;
    transition: all 0.3s ease;
    span {
      color: #3f7dfe;
    }
  }
  ${(props) =>
    props.active &&
    css`
      border-left: 3px solid #3f7dfe;
      background: #eff3ff;
      color: #333;
      transition: all 0.3s ease;
      span {
        color: #3f7dfe;
      }
    `}
`;

const Slide = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 32px;
  p {
    color: #666;
    margin-bottom: 16px;
  }
  a {
    color: #3f7dfe;
    &:after {
      content: '\u276F';
      margin-left: 8px;
    }
  }
  h3 {
    margin: 8px 0;
    font-size: 18px;
    font-weight: 600;
  }
  img {
    line-height: 0;
    border-radius: 16px;
    width: 100%;
  }
`;
