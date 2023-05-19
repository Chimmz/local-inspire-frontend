import React, { useState, useMemo } from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Image from 'next/image';

import useFileUploadsWithDescription from '../../../features/hooks/useFileUploadsWithDescription';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import Layout from '../../../features/components/layout';
import PhotoUploadsWithDescription from '../../../features/components/shared/photo-uploads-with-description/PhotoUploadsWithDescription';
import styles from '../../../styles/sass/pages/AddPhotosPage.module.scss';
import { useRouter } from 'next/router';
import useMiddleware from '../../../features/hooks/useMiddleware';
import api from '../../../features/library/api';
import Spinner from '../../../features/components/shared/spinner/Spinner';
import useRequest from '../../../features/hooks/useRequest';
import SuccessFeedback from '../../../features/components/shared/success/SuccessFeedback';
import { Modal, SSRProvider } from 'react-bootstrap';
import { toTitleCase } from '../../../features/utils/string-utils';
import { ParsedUrlQuery } from 'querystring';

interface PageParams extends ParsedUrlQuery {
  businessName: string;
  businessId: string;
}

interface Props {
  params: PageParams;
}

const AddPhotosPage: NextPage<Props> = function (props) {
  const uploadHook = useFileUploadsWithDescription();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'fail' | undefined>();

  const { withAuth } = useMiddleware();
  const { send: sendSubmitReq, loading: submittingPhotos } = useRequest({
    autoStopLoading: true,
  });
  const router = useRouter();

  const handleUploadImages = async (token?: string) => {
    const formData = new FormData();
    const descriptions = uploadHook.uploads.map(upl => upl.description)! as string[];

    formData.append('descriptions', JSON.stringify(descriptions));
    uploadHook.uploads.map(upl => formData.append('photos', upl.img.rawFile!));

    const req = api.addPhotosOfBusiness({
      formData,
      businessId: props.params.businessId,
      token: token!,
    });
    const res = await sendSubmitReq(req);
    console.log(res);

    if (res.status === 'SUCCESS') {
      setSubmitStatus(res.status.toLowerCase() as 'success' | 'fail');
      router.back();
    }
  };

  const uploadMsg = useMemo(() => {
    if (!submitStatus) return '';
    if (submitStatus === 'success')
      return `${uploadHook.uploads.length} photos of ${props.params?.businessName} you uploaded have been added successfully.`;
    else return `Could not upload ${uploadHook.uploads.length} photos`;
  }, [submitStatus]);

  return (
    <SSRProvider>
      <Layout>
        <Layout.Nav></Layout.Nav>
        <Spinner pageWide show={submittingPhotos} />
        <Modal show={!!submitStatus?.length} centered backdrop="static">
          <Modal.Body>
            <SuccessFeedback
              showSuccessIcon={submitStatus === 'success'}
              title={submitStatus === 'success' ? 'Thank you.' : 'Upload failed.'}
              description={uploadMsg}
              className="mb-5 pt-2"
            />
          </Modal.Body>
        </Modal>

        <Layout.Main className={styles.main}>
          <header className={cls(styles.header, 'container')}>
            <nav>
              {/* <Link href={}> */}
              {props.params?.businessName} <Icon icon="ic:baseline-greater-than" width={10} />{' '}
              Post Photos
            </nav>

            <div className={styles.text}>
              <h1 className="mb-3">
                Have a photo of <strong> {props.params?.businessName}?</strong>
              </h1>
              <p className="parag">
                A picture is worth a thousand words... Paint a picture of this business with any
                photos you have of it...
              </p>
              <button
                className="btn btn-pry btn-curved btn--lg mt-5"
                onClick={setShowUploadModal.bind(null, true)}
              >
                Upload your photos
              </button>
            </div>

            <figure>
              <Image
                src="/img/addphoto-page-hero.png"
                width={500}
                height={300}
                objectFit="cover"
              />
            </figure>
          </header>
          <PhotoUploadsWithDescription
            show={showUploadModal}
            close={setShowUploadModal.bind(null, false)}
            onSave={withAuth.bind(null, handleUploadImages)}
            {...uploadHook}
          />
        </Layout.Main>
      </Layout>
    </SSRProvider>
  );
};

export const getStaticPaths: GetStaticPaths = async function (context) {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async function (context) {
  console.log('Context: ', context.params);

  let { businessId, businessName } = context.params as PageParams;
  businessName = toTitleCase((businessName as string).split('-').join(' '));

  return {
    props: {
      params: { businessId, businessName },
    },
  };
};

export default AddPhotosPage;
