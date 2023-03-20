import { useState, useEffect } from 'react';

type DateFormatOptions = Intl.DateTimeFormatOptions;

const useDate = (rawValue?: string, options?: DateFormatOptions) => {
  const [date, setDate] = useState('');

  const format = function (dateStr?: string) {
    if (!dateStr) return;
    const result = new Intl.DateTimeFormat('en-US', options).format(new Date(dateStr));
    if (rawValue) setDate(result);
    return result;
  };

  useEffect(() => {
    if (options) format(rawValue);
  }, [rawValue]);

  return { date, formatDate: format };
};

export default useDate;
