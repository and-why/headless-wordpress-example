import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import useEmblaCarousel from 'embla-carousel-react';

export default function ContentSlider({ slider }) {
  const [viewportRef, embla] = useEmblaCarousel({ startIndex: 1 });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [embla]);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();

    embla.on('select', onSelect);
  }, [embla, onSelect]);

  return (
    <SliderSection>
      <h2>{slider.sliderTitle}</h2>
      <div className='embla' ref={viewportRef}>
        <div className='embla__container'>
          {slider.slide.map((slide, index) => {
            return (
              <Slide className='embla__slide' key={index} color={slide.slideBgColor}>
                <h3>{slide.slideTitle}</h3>
                <p>{slide.slideDescription}</p>
                <Link href={slide.slideCta.url}>{slide.slideCta.title || 'Read More'}</Link>
              </Slide>
            );
          })}
        </div>
      </div>
      <SliderButtons>
        {slider.slide.map((_, index) => {
          return (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          );
        })}
      </SliderButtons>
    </SliderSection>
  );
}

const DotButton = ({ selected, onClick }) => (
  <Dot active={selected} type='button' onClick={onClick} />
);

const SliderSection = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
  .embla {
    overflow: hidden;
  }
  .embla__container {
    display: flex;
    gap: 32px;
  }
  .selected {
    background: ;
  }
  .embla__slide {
    position: relative;
    flex: 0 0 100%;
    @media (min-width: 600px) {
      flex: 0 0 auto;
      max-width: 300px;
    }
  }
  h2 {
    font-size: 48px;
    line-height: 1.1;
    margin-bottom: 64px;
    color: #2f446f;
    font-weight: 600;
    max-width: 500px;
    text-align: center;
  }
`;

const Slide = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  min-width: 100%;
  width: 100%;
  ${(props) =>
    props.color &&
    css`
      background: ${props.color}14;
    `}
  @media (min-width: 600px) {
    min-width: 300px;
  }
  h3 {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 8px;
    ${(props) =>
      props.color &&
      css`
        color: ${props.color};
      `};
  }
  p {
    color: #666;
    margin-bottom: 32px;
  }
  a {
    font-weight: 600;
    ${(props) =>
      props.color &&
      css`
        color: ${props.color};
      `};
    &:after {
      content: '\u276F';
      margin-left: 8px;
    }
  }
`;

const SliderButtons = styled.div`
  display: flex;
  gap: 8px;
  margin: 32px;
`;

const Dot = styled.button`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background: #bcc6f3;
  cursor: pointer;
  ${(props) =>
    props.active &&
    css`
      background: #6c84f0;
    `};
`;
