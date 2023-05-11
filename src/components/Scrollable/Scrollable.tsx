/* eslint-disable max-lines-per-function */
import React, { memo, useCallback, useEffect, useRef, useState, CSSProperties, FC, ReactNode } from 'react';
import { flushSync } from 'react-dom';
import styled from 'styled-components';

const OFFSET_TRACK_HEIGHT = 6;

interface IScrollRef {
  x: number;
  y: number;
}

interface IScrollableProps {
  scrollableOffsetHeight?: number;
  children?: ReactNode;
  height?: string;
  maxHeight?: string;
  width?: string;
  trackColor?: string;
  thumbColor?: string;
  scrollbarWidth?: number;
  scrollableOffsetTop?: number;
  scrollbarVerticalPositionRight?: number;
  verticalFixRight?: boolean;
  paddingBottom?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
  style?: CSSProperties;
}

export const Scrollable: FC<IScrollableProps> = memo(
  ({
    children,
    maxHeight = 'auto',
    height = '100%',
    width = 'auto',
    verticalFixRight,
    trackColor,
    thumbColor,
    scrollbarWidth,
    scrollableOffsetTop,
    scrollableOffsetHeight,
    scrollbarVerticalPositionRight = 0,
    paddingBottom = 0,
    direction = 'vertical',
    style
  }) => {
    const [verticalThumbHeight, setVerticalThumbHeight] = useState(20);
    const [horizontalThumbHeight, setHorizontalThumbHeight] = useState(20);
    const [isVerticalScrollVisible, setIsVerticalScrollVisible] = useState(true);
    const [isHorizontalScrollVisible, setIsHorizontalScrollVisible] = useState(true);

    const [scrollStartPosition, setScrollStartPosition] = useState<number | null>(null);
    const [initialScrollTop, setInitialScrollTop] = useState<number>(0);

    const [horizontalScrollStartPosition, setHorizontalScrollStartPosition] = useState<number | null>(null);
    const [initialScrollLeft, setInitialScrollLeft] = useState<number>(0);

    const [isDragging, setIsDragging] = useState(false);

    const dragTargetId = useRef<string>('');
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<IScrollRef>({ x: 0, y: 0 });
    const observer = useRef<ResizeObserver | null>(null);

    const verticalScrollTrackRef = useRef<HTMLDivElement>(null);
    const verticalScrollThumbRef = useRef<HTMLDivElement>(null);
    const horizontalScrollTrackRef = useRef<HTMLDivElement>(null);
    const horizontalScrollThumbRef = useRef<HTMLDivElement>(null);

    const handleResize = useCallback((ref: HTMLDivElement) => {
      const { clientHeight, scrollHeight, clientWidth, scrollWidth } = ref;
      const verticalScrollTrackElement = verticalScrollTrackRef.current;
      const horizontalScrollTrackElement = horizontalScrollTrackRef.current;

      if (verticalScrollTrackElement) {
        const { clientHeight: trackHeight } = verticalScrollTrackElement;
        const newThumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 20);

        flushSync(() => {
          setIsVerticalScrollVisible(scrollHeight > clientHeight);
          setVerticalThumbHeight(newThumbHeight);
        });
      }

      if (horizontalScrollTrackElement) {
        const { clientWidth: trackWidth } = horizontalScrollTrackElement;
        const newThumbWidth = Math.max((clientWidth / scrollWidth) * trackWidth, 20);

        flushSync(() => {
          setIsHorizontalScrollVisible(scrollWidth > clientWidth);
          setHorizontalThumbHeight(newThumbWidth);
        });
      }
    }, []);

    const handleTrackClick = useCallback((e, scrollTrackElement: HTMLDivElement | null, thumbHeight: number) => {
      e.preventDefault();
      e.stopPropagation();

      const scrollContentWrapperRef = contentWrapperRef.current;

      if (scrollTrackElement && scrollContentWrapperRef) {
        const { clientY, clientX, target } = e;
        const direction = target.id.includes('vertical') ? 'vertical' : 'horizontal';
        const { top: trackTop, left: trackLeft } = target.getBoundingClientRect();
        const { clientHeight, clientWidth } = scrollTrackElement;
        const { scrollHeight, scrollWidth } = scrollContentWrapperRef;

        const thumbOffset = -(thumbHeight / 2);
        const trackValue = direction === 'vertical' ? trackTop : trackLeft;
        const clientValue = direction === 'vertical' ? clientY : clientX;
        const trackDimension = direction === 'vertical' ? clientHeight : clientWidth;
        const scrollContentDimension = direction === 'vertical' ? scrollHeight : scrollWidth;

        const clickRatio = (clientValue - trackValue + thumbOffset) / trackDimension;
        const scrollAmount = Math.floor(clickRatio * scrollContentDimension);

        if (direction === 'vertical') {
          scrollContentWrapperRef.scrollTo({
            top: scrollAmount,
            behavior: 'smooth'
          });
        } else {
          scrollContentWrapperRef.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    }, []);

    const handleThumbMousedown = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();

      const { clientY, clientX } = e;
      const contentWrapperElement = contentWrapperRef.current;
      dragTargetId.current = e.target.id;

      flushSync(() => {
        setScrollStartPosition(clientY);
        setHorizontalScrollStartPosition(clientX);
      });

      if (contentWrapperElement) {
        flushSync(() => {
          setInitialScrollTop(contentWrapperElement.scrollTop);
          setInitialScrollLeft(contentWrapperElement.scrollLeft);
        });
      }

      setIsDragging(true);
    }, []);

    const handleThumbMouseup = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isDragging) {
          setIsDragging(false);
          dragTargetId.current = '';
        }
      },
      [isDragging]
    );

    const handleThumbMousemove = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        const contentWrapperElement = contentWrapperRef.current;

        if (isDragging && contentWrapperElement) {
          const { clientY, clientX } = e;

          const {
            scrollHeight: contentScrollHeight,
            offsetHeight: contentOffsetHeight,
            scrollWidth: contentScrollWidth,
            offsetWidth: contentOffsetWidth
          } = contentWrapperElement;

          const scrollDirection = dragTargetId.current.includes('vertical') ? 'vertical' : 'horizontal';
          const thumbHeight = scrollDirection === 'vertical' ? verticalThumbHeight : horizontalThumbHeight;

          if (scrollDirection === 'vertical') {
            const deltaY = (clientY - (scrollStartPosition || 0)) * (contentOffsetHeight / thumbHeight);
            const newScrollTop = Math.min(initialScrollTop + deltaY, contentScrollHeight - contentOffsetHeight);

            contentWrapperElement.scrollTop = newScrollTop;
          } else {
            const deltaX = (clientX - (horizontalScrollStartPosition || 0)) * (contentOffsetWidth / thumbHeight);
            const newScrollLeft = Math.min(initialScrollLeft + deltaX, contentScrollWidth - contentOffsetWidth);

            contentWrapperElement.scrollLeft = newScrollLeft;
          }
        }
      },
      [
        isDragging,
        verticalThumbHeight,
        horizontalThumbHeight,
        scrollStartPosition,
        initialScrollTop,
        horizontalScrollStartPosition,
        initialScrollLeft
      ]
    );

    const handleThumbPosition = useCallback(
      // eslint-disable-next-line complexity
      () => {
        if (!contentWrapperRef.current) {
          return;
        }

        const verticalScrollTrackElement = verticalScrollTrackRef.current;
        const verticalScrollThumbElement = verticalScrollThumbRef.current;
        const horizontalScrollTrackElement = horizontalScrollTrackRef.current;
        const horizontalScrollThumbElement = horizontalScrollThumbRef.current;
        const { x, y } = scrollRef.current;

        const {
          scrollTop: contentTop,
          scrollHeight: contentHeight,
          scrollLeft: contentLeft,
          scrollWidth: contentWidth
        } = contentWrapperRef.current;

        const scrollDirection = (() => {
          if (contentTop !== y) {
            scrollRef.current = { x, y: contentTop };
            return 'vertical';
          }

          scrollRef.current = { x: contentLeft, y };
          return 'horizontal';
        })();

        if (scrollDirection === 'vertical' && verticalScrollTrackElement && verticalScrollThumbElement) {
          const { clientHeight: trackHeight } = verticalScrollTrackElement;
          const newTop = Math.min((contentTop / contentHeight) * trackHeight, trackHeight - verticalThumbHeight);
          verticalScrollThumbElement.style.top = `${newTop}px`;
        } else if (horizontalScrollTrackElement && horizontalScrollThumbElement) {
          const { clientWidth: trackWidth } = horizontalScrollTrackElement;
          const newLeft = Math.min((contentLeft / contentWidth) * trackWidth, trackWidth - horizontalThumbHeight);
          horizontalScrollThumbElement.style.left = `${newLeft}px`;
        }
      },
      [horizontalThumbHeight, verticalThumbHeight]
    );

    // eslint-disable-next-line consistent-return
    useEffect(() => {
      if (contentWrapperRef.current && contentRef.current) {
        const contentWrapperElement = contentWrapperRef.current;
        const contentElement = contentRef.current;

        observer.current = new ResizeObserver(() => {
          requestAnimationFrame(() => {
            handleResize(contentWrapperElement);
          });
        });

        contentWrapperElement.addEventListener('scroll', handleThumbPosition);
        observer.current.observe(contentWrapperElement);
        observer.current.observe(contentElement);

        return () => {
          contentWrapperElement.removeEventListener('scroll', handleThumbPosition);
          observer.current?.unobserve(contentWrapperElement);
          observer.current?.unobserve(contentElement);
        };
      }
    }, [direction, handleResize, handleThumbPosition]);

    useEffect(() => {
      document.addEventListener('mousemove', handleThumbMousemove);
      document.addEventListener('mouseup', handleThumbMouseup);
      document.addEventListener('mouseleave', handleThumbMouseup);

      return () => {
        document.removeEventListener('mousemove', handleThumbMousemove);
        document.removeEventListener('mouseup', handleThumbMouseup);
        document.removeEventListener('mouseleave', handleThumbMouseup);
      };
    }, [direction, handleThumbMousemove, handleThumbMouseup]);

    return (
      <ScrollableContainer $height={height} $width={width} style={style}>
        <ScrollableContent ref={contentWrapperRef} $maxHeight={maxHeight} $paddingBottom={paddingBottom}>
          <div ref={contentRef}>{children}</div>
        </ScrollableContent>
        {(direction === 'vertical' || direction === 'both') && (
          <ScrollableScrollbar
            $scrollbarVerticalPositionRight={scrollbarVerticalPositionRight}
            $isVisible={isVerticalScrollVisible}
            $verticalFixRight={verticalFixRight}
            $scrollDirection="vertical"
            $scrollWidth={scrollbarWidth}
            $scrollableOffsetHeight={scrollableOffsetHeight}
            $scrollableOffsetTop={scrollableOffsetTop}
          >
            <ScrollableScrollbarTrack
              id="verticalTrack"
              ref={verticalScrollTrackRef}
              $scrollDirection="vertical"
              $trackColor={trackColor}
              $isDragging={isDragging}
              onClick={(e) => handleTrackClick(e, verticalScrollTrackRef.current, verticalThumbHeight)}
            />
            <ScrollableScrollbarThumb
              id="verticalThumb"
              ref={verticalScrollThumbRef}
              $scrollDirection="vertical"
              $thumbColor={thumbColor}
              $isDragging={isDragging}
              $height={verticalThumbHeight}
              onMouseDown={handleThumbMousedown}
            />
          </ScrollableScrollbar>
        )}
        {(direction === 'horizontal' || direction === 'both') && (
          <ScrollableScrollbar
            $isVisible={isHorizontalScrollVisible}
            $scrollDirection="horizontal"
            $scrollWidth={scrollbarWidth}
          >
            <ScrollableScrollbarTrack
              id="horizontalTrack"
              ref={horizontalScrollTrackRef}
              $scrollDirection="horizontal"
              $trackColor={trackColor}
              $isDragging={isDragging}
              onClick={(e) => handleTrackClick(e, horizontalScrollTrackRef.current, horizontalThumbHeight)}
            />
            <ScrollableScrollbarThumb
              id="horizontalThumb"
              ref={horizontalScrollThumbRef}
              $scrollDirection="horizontal"
              $thumbColor={thumbColor}
              $isDragging={isDragging}
              $height={horizontalThumbHeight}
              onMouseDown={handleThumbMousedown}
            />
          </ScrollableScrollbar>
        )}
      </ScrollableContainer>
    );
  }
);

interface IScrollableContainerStyledProps {
  $height: string;
  $width: string;
}

const ScrollableContainer = styled.div<IScrollableContainerStyledProps>`
  position: relative;
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
`;

interface IScrollableContentStyledProps {
  $paddingBottom?: number;
  $maxHeight: string;
}

const ScrollableContent = styled.div<IScrollableContentStyledProps>`
  height: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight};
  padding-bottom: ${({ $paddingBottom }) => `${$paddingBottom}px`};

  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

interface IScrollabeScrollbarStyledProps {
  $isVisible: boolean;
  $scrollDirection: 'horizontal' | 'vertical';
  $scrollWidth?: number;
  $scrollbarVerticalPositionRight?: number;
  $verticalFixRight?: boolean;
  $scrollableOffsetHeight?: number;
  $scrollableOffsetTop?: number;
}

const ScrollableScrollbar = styled.div<IScrollabeScrollbarStyledProps>`
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  position: ${({ $verticalFixRight }) => ($verticalFixRight ? 'fixed' : 'absolute')};

  ${({
    $scrollDirection,
    $scrollWidth,
    $scrollbarVerticalPositionRight,
    $scrollableOffsetHeight = 0,
    $scrollableOffsetTop = 0
  }) => {
    if ($scrollDirection === 'vertical') {
      return {
        width: $scrollWidth ? $scrollWidth : 16,
        height: `calc(100% - ${OFFSET_TRACK_HEIGHT + $scrollableOffsetHeight}px)`,
        right: `${$scrollbarVerticalPositionRight || 0}px`,
        top: $scrollableOffsetTop || 2,
        zIndex: 99
      };
    }

    return {
      height: $scrollWidth ? $scrollWidth : 16,
      width: `calc(100% - ${OFFSET_TRACK_HEIGHT}px)`,
      left: 2,
      bottom: 0,
      zIndex: 99
    };
  }}
`;

interface IScrollableScrollbarTrackStyledProps {
  $isDragging: boolean;
  $scrollDirection: 'horizontal' | 'vertical';
  $trackColor?: string;
}

const ScrollableScrollbarTrack = styled.div<IScrollableScrollbarTrackStyledProps>`
  background-color: ${({ $trackColor }) => $trackColor || 'transparent'};
  cursor: ${({ $isDragging }) => ($isDragging ? 'grab' : 'pointer')};

  width: 100%;
  height: 100%;
`;

interface IScrollableScrollbarThumbStyledProps {
  $height: number;
  $scrollDirection: 'horizontal' | 'vertical';
  $isDragging: boolean;
  $thumbColor?: string;
}

const ScrollableScrollbarThumb = styled.div<IScrollableScrollbarThumbStyledProps>`
  cursor: ${({ $isDragging }) => ($isDragging ? 'grab' : 'pointer')};
  position: absolute;
  top: 0;

  background-color: ${({ $thumbColor }) => $thumbColor || '#dddddd'};
  border-radius: 12px;

  ${({ $scrollDirection, $height }) => {
    if ($scrollDirection === 'vertical') {
      return {
        height: `${$height}px`,
        width: '100%'
      };
    }

    return {
      height: '100%',
      width: `${$height}px`
    };
  }}
`;
