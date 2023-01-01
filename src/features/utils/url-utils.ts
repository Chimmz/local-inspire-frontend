import { NextRouter } from 'next/router';

const navigateTo = function (path: string, router: NextRouter) {
  router.push(path);
};

export const getBusinessSearchResultsUrl = ({
  category,
  city,
  stateCode,
}: {
  category: string;
  city: string;
  stateCode: string;
}) => {
  const [categParam, cityParam, stateParam] = [
    category.toLowerCase().split(' ').join('-'),
    city.toLowerCase().split(' ').join('-'),
    stateCode.toUpperCase(),
  ];
  return `/reviews/find=${categParam}&location=${cityParam}-${stateParam}`;
};

export const parseBusinessSearchUrlParams = (
  str: string,
): { category: string; city: string; stateCode: string | undefined } | Error => {
  if (['find=', 'location='].some(substr => !str.includes(substr))) return new Error('');

  let [categoryPart, locationPart] = str.split('&');
  const category = categoryPart.replace('find=', '').split('-').join(' ');

  const location = locationPart.replace('location=', '').split('-'); // anchorage-AK
  const city = location.slice(0, -1).join(' ');
  const stateCode = location.slice(-1).pop()?.toUpperCase();

  return { category, city, stateCode };
};

export const genRecommendBusinessPageUrl = (
  businessId: string,
  businessName: string,
  city: string,
  stateCode: string,
  recommends: boolean,
) => {
  return `/write-a-review/${businessName.split(' ').join('-')}_${city
    .split(' ')
    .join('-')}-${stateCode}_${businessId}`.concat(
    recommends !== null ? `?recommend=${recommends ? 'yes' : 'no'}` : '',
  );
};

export default navigateTo;
