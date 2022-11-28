import { Icon } from '@iconify/react';
import cls from 'classnames';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '../../features/components/shared/spinner/Spinner';
import API from '../../features/library/api';
import styles from '../../styles/sass/pages/PasswordReset.module.scss';
import PageSuccess from '../../features/components/shared/success/PageSuccess';
import useRequest from '../../features/hooks/useRequest';

const AccountConfirmation: NextPage = () => {
  const [confirmed, setConfirmed] = useState({ msg: '' });
  const router = useRouter();
  console.log('Query: ', router.query);
  const { send, loading } = useRequest({ autoStopLoading: true });

  useEffect(() => {
    setTimeout(async () => {
      const res = await send(API.confirmAccount(router.query.code as string));
      if (res.status === 'SUCCESS') setConfirmed({ msg: res.msg });
      console.log(res);
    }, 2000);
  }, []);

  return (
    <main className={styles.main}>
      {confirmed.msg.length ? (
        <PageSuccess title={'Confirmed!'} description={confirmed.msg} />
      ) : loading ? (
        <Spinner />
      ) : (
        'Something went wrong'
      )}
    </main>
  );
};

export default AccountConfirmation;
