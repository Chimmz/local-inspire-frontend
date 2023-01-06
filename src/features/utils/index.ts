export const scrollToElement = (query: string) => {
  const elem = document.querySelector(query);
  console.log({ elem });
  if (!elem) return;
  elem.scrollIntoView({ behavior: 'smooth' });
};
