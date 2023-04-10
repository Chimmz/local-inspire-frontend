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

  const nextCount = useMemo(() => {
    if (!maxLimit) return count + step;
    return count + step > maxLimit ? maxLimit : count + step;
  }, [count, step]);

  const increment = () => {
    if (maxLimit && nextCount > maxLimit) setCount(maxLimit);
    else setCount(nextCount);
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
    nextCount: nextCount,
    isAtMax: useMemo(() => count === maxLimit, [count, maxLimit]),
    isAtMin: useMemo(() => count === min, [count, maxLimit]),
  };
};

export default useCounter;
