import React, { useState } from 'react';

const useFeatureRatings = function (features: string[]) {
  const [ratingMap, setRatingMap] = useState<{ [f: string]: number }>({});

  const changeFeatureRating = (feature: string, rating: number) => {
    if (!features.includes(feature)) return;
    setRatingMap(map => ({ ...map, [feature]: rating }));
  };

  return { ratingMap, changeFeatureRating };
};

export default useFeatureRatings;
