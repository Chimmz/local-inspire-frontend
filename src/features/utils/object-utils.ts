export const filterObject = (obj: { [key: string]: any }, keys: string[]) => {
  for (const k of Object.keys(obj)) if (!keys.includes(k)) delete obj[k];
  return obj;
};
