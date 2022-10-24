export const toTitleCase = (str: string, divider = ' ') => {
  return str
    .toLowerCase()
    .split(divider)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(divider);
};

export const toCamelCase = (str: string, divider = ' ') => {
  return str
    .toLowerCase()
    .split(divider)
    .map((word, i) => {
      if (i !== 0) return word[0].toUpperCase() + word.slice(1);
      return word;
    })
    .join('');
};

export const addSuffixToNumber = (number: string | number) => {
  console.log('ARG: ', number);
  let s = ['th', 'st', 'nd', 'rd'];
  let v = +number % 100;
  return number + (s[(v - 20) % 10] || s[v] || s[0]);
};