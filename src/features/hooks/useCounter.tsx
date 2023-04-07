import React, { useState, useMemo } from 'react';

interface Params {
  init: number;
  step: number;
  min?: number;
  max?: number;
}

const useCounter = ({ init = 1, step = 1, min = 0, ...args }: Params) => {
  const [count, setCount] = useState(init);
  const [maxLimit, setMaxLimit] = useState(args.max);

  const nextSuccessiveCount = useMemo(() => count + step, [count, step]);

  const increment = () => {
    if (maxLimit && nextSuccessiveCount > maxLimit) setCount(maxLimit);
    else setCount(nextSuccessiveCount);
  };

  const decrement = () => {
    if (min && count - step < min) setCount(min);
    else setCount(count - step);
  };

  return {
    count,
    increment,
    decrement,
    setMaxLimit,
    reset: setCount.bind(null, init),
    nextCount: nextSuccessiveCount,
    isAtMax: useMemo(() => count === maxLimit, [count, maxLimit]),
    isAtMin: useMemo(() => count === min, [count, maxLimit]),
  };
};

export default useCounter;
