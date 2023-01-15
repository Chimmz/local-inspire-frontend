import { useState, useEffect } from 'react';

type DateFormatOptions = Intl.DateTimeFormatOptions;

const useDate = (rawValue: string, options?: DateFormatOptions) => {
  const [date, setDate] = useState('');

  const format = function () {
    if (!rawValue) return;

    const result = new Intl.DateTimeFormat(window.navigator?.language, options).format(
      new Date(rawValue),
    );
    setDate(result);
  };

  useEffect(() => {
    if (options) format();
  }, [rawValue]);

  return { date };
};

export default useDate;
