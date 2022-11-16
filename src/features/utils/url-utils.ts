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
    'AK',
  ];
  return `/reviews/find=${categParam}&location=${cityParam}-${stateCode}`;
};
