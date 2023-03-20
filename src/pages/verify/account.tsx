import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '../../features/components/shared/spinner/Spinner';
import API from '../../features/library/api';
import styles from '../../styles/sass/pages/PasswordReset.module.scss';
import PageSuccess from '../../features/components/shared/success/PageSuccess';
import useRequest from '../../features/hooks/useRequest';

const AccountConfirmation: NextPage = () => {
  const [response, setResponse] = useState<null | {
    status: 'SUCCESS' | 'FAIL';
    msg: string;
  }>(null);

  const router = useRouter();
  console.log('Query: ', router.query);
  const { send, loading } = useRequest({ autoStopLoading: true });

  const confirm = async () => {
    const res = await send(API.confirmMyAccount(router.query.email as string));
    console.log(res);
    setResponse(res);
  };

  useEffect(() => {
    if (!router.query.email?.length) return;
    confirm();
  }, [router.query.email]);

  return (
    <main className={styles.main}>
      {!response || loading ? (
        <Spinner />
      ) : response?.status === 'SUCCESS' ? (
        <PageSuccess title="Confirmed!" description={response?.msg} />
      ) : (
        <h3>{response?.msg || 'Something went wrong'}</h3>
      )}
    </main>
  );
};

export default AccountConfirmation;
