export const scrollToElement = (query: string | HTMLElement) => {
  if (typeof query === 'string')
    return document.querySelector(query)?.scrollIntoView({ behavior: 'smooth' });

  query.scrollIntoView({ behavior: 'smooth' });
};
