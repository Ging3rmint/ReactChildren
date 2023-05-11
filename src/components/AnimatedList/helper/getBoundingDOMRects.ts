import { Children } from 'react';

export interface IBoundingDOMRects {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

// Using any here since ReactNode, ReactElement and JSX.Element does not have Ref
const getBoundingDOMRects = (children: any[]) => {
  const boundingRects: Partial<IBoundingDOMRects> = {};

  Children.forEach(children, ({ key, ref }) => {
    if (!key || !ref) {
      return;
    }

    const node = ref.current;

    if (node) {
      const nodeBoundingRect = node.getBoundingClientRect();
      boundingRects[key] = nodeBoundingRect;
    }
  });

  return boundingRects;
};

export default getBoundingDOMRects;
