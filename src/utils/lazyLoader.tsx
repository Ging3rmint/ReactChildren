import React, {
  Suspense,
  ReactNode,
  PropsWithChildren,
  PropsWithoutRef,
  lazy,
  ComponentType,
} from "react";

export interface ILazyLoader<P> {
  (): Promise<{ default: ComponentType<P> }>;
}

const lazyLoader = <P extends unknown>(
  loader: ILazyLoader<P>,
  loading: ReactNode = null
) => {
  const LazyComponent = lazy(loader);

  const SuspenseComponent = (props: PropsWithChildren<PropsWithoutRef<P>>) => (
    <Suspense fallback={loading}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return SuspenseComponent;
};

export default lazyLoader;
