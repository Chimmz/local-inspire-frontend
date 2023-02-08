import { NextRouter } from 'next/router';
import { toTitleCase } from './string-utils';

type BusinessPageUrlParams<T> = T extends string
  ? { slug: string }
  : { businessId?: string; businessName?: string; city?: string; stateCode?: string };

type ParseBusinessSlugOptions = {
  titleCase: boolean;
} | null;

type QuestionDetailsPageUrlParams = (
  | { slug: string }
  | {
      businessName: string;
      location?: string;
      stateCode?: string;
      city?: string;
      qText: string;
      qId: string;
    }
) & { scrollToAnswerForm?: boolean };

type UserReviewPageUrlParams =
  | { slug: string }
  | { businessName: string; city: string; stateCode?: string; reviewId: string };

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

export const parseQuestionsPageSlug = (slug: string, options?: ParseBusinessSlugOptions) => {
  let [businessName, location, businessId] = slug.split('_');

  if (options?.titleCase) {
    businessName = toTitleCase(businessName.split('-').join(' '));

    return {
      businessName,
      location,
      businessId,
    };
  }
  return { businessName, location, businessId };
};

const transformBusinessUrlParams = (args: BusinessPageUrlParams<{}>) => {
  const city = args.city?.toLowerCase().split(' ').join('-');
  const stateCode = args.stateCode?.toUpperCase();

  return {
    ...args,
    businessName: args.businessName?.toLowerCase().split(' ').join('-'),
    city,
    stateCode,
    location: city?.concat('-').concat(stateCode || ''),
  };
};

export function genRecommendBusinessPageUrl<T>(
  args: BusinessPageUrlParams<T> & { recommends: boolean | null },
) {
  const queryStr =
    args.recommends !== null ? `?recommend=${args.recommends ? 'yes' : 'no'}` : '';

  if ('slug' in args) return `/write-a-review/${args.slug}`.concat(queryStr);
  const {
    businessName: name,
    city,
    stateCode,
    businessId: id,
  } = transformBusinessUrlParams(args);
  return `/write-a-review/${name}_${city}-${stateCode}_${id}`.concat(queryStr);
}

export function genBusinessPageUrl<T>(
  args: BusinessPageUrlParams<T extends string ? string : {}>,
) {
  if ('slug' in args) return `/v/${args.slug}`;

  const {
    businessName: name,
    city,
    stateCode,
    businessId: id,
  } = transformBusinessUrlParams(args);

  return `/v/${name}_${city?.split(' ').join('-')}-${stateCode}_${id}`;
}

export const getBusinessQuestionsUrl = function <T>(
  args: BusinessPageUrlParams<T> & { promptNewQuestion?: boolean },
) {
  if ('slug' in args)
    return `/questions/${args.slug}`.concat(args.promptNewQuestion ? '#new-question' : '');
  const {
    businessName: name,
    city,
    stateCode,
    businessId: id,
  } = transformBusinessUrlParams(args);
  return `/questions/${name}_${city}-${stateCode}_${id}`.concat(
    args.promptNewQuestion ? '#new-question' : '',
  );
};

export const genQuestionDetailsPageUrl = (params: QuestionDetailsPageUrlParams) => {
  let url: string;
  if ('slug' in params) url = `/question/${params.slug}`;
  else {
    let { businessName, qText, qId } = params;
    businessName = businessName.split(' ').join('-').toLowerCase().trim();

    qText = qText.split(' ').join('-').toLowerCase();
    while (qText.includes('?')) qText = qText.replace('?', '');

    const location =
      'location' in params
        ? params.location
        : [params.city?.toLowerCase(), params.stateCode?.toUpperCase()].join('-');

    url = `/question/${businessName}_${location}_${qText}_${qId}`;
  }

  if (params.scrollToAnswerForm) return url.concat('#new-answer');
  return url;
};

export const genAddPhotosPageUrl = (businessId: string, businessName: string) => {
  return `/add-photos/${businessId}/${businessName.toLowerCase().split(' ').join('-')}`;
};

// chicken-express_TX_63d6f2e02a4c348418afdb16
export const genUserReviewPageUrl = (args: UserReviewPageUrlParams) => {
  if ('slug' in args) return `/user-review/${args.slug}`;
  const { businessName, location } = transformBusinessUrlParams(args);

  return `/user-review/${businessName}_${location}_${args.reviewId}`;
};
export const parseUserReviewPageSlug = (slug: string) => {
  const [businessName, stateCode, reviewId] = slug.split('_').map(param => param.trim());
  return { businessName, stateCode, reviewId };
};

export default navigateTo;
