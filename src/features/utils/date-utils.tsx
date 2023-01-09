// export interface DateFormatOptions {
//   month?: true,
//   year: true
// }

export const formatDate = (str: string, options: Intl.DateTimeFormatOptions) => {
  if (typeof window === 'undefined') return '';
  const dateStr = new Intl.DateTimeFormat(window.navigator?.language, options).format(
    new Date(str),
  );
  return dateStr;
};
