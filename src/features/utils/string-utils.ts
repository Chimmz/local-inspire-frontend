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

export const toLowerSnakeCase = (str: string) => {
  return str.toLowerCase().split(' ').join('_');
};

export const addSuffixToNumber = (number: string | number) => {
  console.log('ARG: ', number);
  let s = ['th', 'st', 'nd', 'rd'];
  let v = +number % 100;
  return number + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const parseBusinessSearchUrlParams = (
  str: string,
): { category: string; city: string; stateCode: string | undefined } | Error => {
  if (['find=', 'location='].some(substr => !str.includes(substr))) return new Error('');

  let [categoryPart, locationPart] = str.split('&');
  const category = categoryPart.replace('find=', '').split('-').join(' ');

  const location = locationPart.replace('location=', '').split('-'); // anchorage-AK
  const stateCode = location.slice(-1).pop();
  const city = location.slice(0, -1).join(' ');

  return { category, city, stateCode };
};
