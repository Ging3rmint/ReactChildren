import React, { useEffect, useRef } from 'react';

const usePrevious = <T extends unknown>(value: T) => {
  const prevValueRef = useRef<T>();

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  return prevValueRef.current;
};

export default usePrevious;
