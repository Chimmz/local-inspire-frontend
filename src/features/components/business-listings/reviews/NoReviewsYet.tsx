import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { genRecommendBusinessPageUrl } from '../../../utils/url-utils';

import { Icon } from '@iconify/react';
import cls from 'classnames';
import styles from './Reviews.module.scss';

interface Props {
  businessName?: string;
  show: boolean;
}

const NoReviewsYet = function (props: Props) {
  const router = useRouter();
  const slug = router.query.businessPageSlug as string;

  const showStyle = props.show ? 'd-block' : 'd-none';

  return (
    <section className={cls(showStyle, 'd-flex flex-column align-items-center')}>
      <Icon icon="bi:chat-dots-fill" width={45} color="#4b4b4b" />
      <h4 className="fs-2 text-dark mt-4 mb-3">No reviews yet</h4>
      <p className="parag mb-5 text-center" style={{ maxWidth: '50ch' }}>
        Write about your experience, the good, the bad, or any helpful advice for our
        visitors.
      </p>

      <strong className="text-dark fs-5 mb-3">Do you recommend {props.businessName}?</strong>
      <div className="d-flex align-items-center gap-2">
        <Link href={genRecommendBusinessPageUrl<string>({ slug, recommends: true })} passHref>
          <a className="btn btn-outline-gray flex-grow-1 w-100" style={{ minWidth: '120px' }}>
            Yes
          </a>
        </Link>

        <Link
          href={genRecommendBusinessPageUrl<string>({ slug, recommends: false })}
          passHref
        >
          <a className="btn btn-outline-gray flex-grow-1 w-100" style={{ minWidth: '120px' }}>
            No
          </a>
        </Link>
      </div>
    </section>
  );
};
export default NoReviewsYet;
