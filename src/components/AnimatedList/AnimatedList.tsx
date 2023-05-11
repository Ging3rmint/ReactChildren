import React, { FC, useEffect, useState, Children, useLayoutEffect, memo } from 'react';
import styled from 'styled-components';

import getBoundingDOMRects, { IBoundingDOMRects } from './helper/getBoundingDOMRects';
import usePrevious from './hooks/usePrevious';

/**
 * Using any here since ReactNode, ReactElement and JSX.Element does not have Ref
 * Another way would be to ref its children seperately into childrenRef and then access it outside of Children map
 * However, this would require another Children map in a useMemo to apply the ref into childrenRef
 * extending ReactNode, ReactElement and JSX.Element introduces more typescript errors
 */
interface IAnimatedListProps {
  children: any[];
  boxShadowOnAnimate?: boolean;
  transitionTime?: number;
  className?: string;
  pauseAnimate?: boolean;
}

const AnimatedList: FC<IAnimatedListProps> = ({
  children,
  boxShadowOnAnimate,
  transitionTime = 500,
  pauseAnimate,
  className
}) => {
  const [boundingDOMRects, setBoundingDOMRects] = useState<Partial<IBoundingDOMRects>>({});
  const [prevBoundingDOMRects, setPrevBoundingDOMRects] = useState<Partial<IBoundingDOMRects>>({});
  const prevChildren = usePrevious(children);

  // Capture the DOM client rectangle values of current nodes
  useLayoutEffect(() => {
    if (children) {
      const newBoundingDOMRects = getBoundingDOMRects(children);
      setBoundingDOMRects(newBoundingDOMRects);
    }
  }, [children]);

  // Capture the DOM client rectangle values of previous nodes
  useLayoutEffect(() => {
    if (prevChildren) {
      const prevBoundingDOMRects = getBoundingDOMRects(prevChildren);
      setPrevBoundingDOMRects(prevBoundingDOMRects);
    }
  }, [prevChildren]);

  // Detect change in children and capture the difference in Y position
  useEffect(() => {
    const hasPrevBoundingDOMRects = Object.keys(prevBoundingDOMRects).length;

    if (hasPrevBoundingDOMRects) {
      Children.forEach(children, ({ key, ref }) => {
        if (!key || !ref) {
          return;
        }

        const node = ref.current;
        const { top: prevTargetYPosition } = prevBoundingDOMRects[key] || {};
        const { top: curTargetYPosition } = boundingDOMRects[key] || {};
        const changeY = prevTargetYPosition - curTargetYPosition;

        if (changeY && !pauseAnimate) {
          requestAnimationFrame(() => {
            if (boxShadowOnAnimate) {
              node.style.boxShadow = '2px 2px 19px 0px rgba(0, 0, 0, 0.47)';
            }

            // Set the changing node to its original position before UI repaint
            node.style.transform = `translateY(${changeY}px)`;
            node.style.transition = '';

            // Release the node from its original position in the next frame and apply transition to slow it down
            requestAnimationFrame(() => {
              node.style.transform = '';
              node.style.boxShadow = '';
              node.style.transition = `all ${transitionTime}ms ease-in-out`;
            });
          });
        }
      });
    }
  }, [prevBoundingDOMRects, boundingDOMRects, children]);

  return <AnimatedListContainer className={className}>{children}</AnimatedListContainer>;
};

export default memo(AnimatedList);

const AnimatedListContainer = styled.div``;
