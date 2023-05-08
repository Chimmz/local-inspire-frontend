import React, { useState } from 'react';
import Image from 'next/image';
import { signIn, SignInOptions } from 'next-auth/react';
import FacebookLogin from '@greatsumini/react-facebook-login';

import { useNewRegistrationContext } from '../../../contexts/NewRegistrationContext';
import useRequest from '../../../hooks/useRequest';
import { datesOfTheMonth, monthsOfTheYear, yearsSince1940 } from '../../../data/constants';

import AuthContentWrapper from '../AuthContentWrapper';
import FacebookIcon from '@mui/icons-material/Facebook';
import ComputerIcon from '@mui/icons-material/Computer';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from '../../shared/spinner/Spinner';
import cls from 'classnames';
import styles from '../Auth.module.scss';
import AuthNav from '../AuthNav';
import useDeviceFileUpload from '../../../hooks/useDeviceFileUpload';
import api from '../../../library/api';

interface Props {
  goBack: () => void;
  closeModal: () => void;
}

interface BirthInfo {
  year: number | null;
  month: string;
  day: number | null;
}

const MoreSignupDetails: React.FC<Props> = props => {
  const authData = useNewRegistrationContext();
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [facebookEmail, setFacebookEmail] = useState<string | null>(null);
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({ year: null, month: '', day: null });
  const {
    uploadedFile: uploadedFile,
    setUploadedFile: setUploadedFile,
    onChangeFile: handleChangeFileInput,
  } = useDeviceFileUpload({ type: 'image' });

  const {
    send: sendSignupRequest,
    loading: isAuthenticating,
    stopLoading,
  } = useRequest({
    autoStopLoading: false,
  });

  const changeBirthInfo = (field: 'day' | 'month' | 'year', newValue: string | number) => {
    setBirthInfo(info => ({ ...info, [field]: newValue }));
  };

  const authenticate = async function (credentials: object) {
    try {
      const formData = new FormData();
      for (let [key, val] of Object.entries(credentials)) formData.append(key, val);

      const res = await sendSignupRequest(api.signup(formData));
      console.log('fnAuthenticate Response: ', res);

      switch (res?.status) {
        case 'SUCCESS':
          const options: SignInOptions = { user: JSON.stringify(res.data), redirect: false };
          await signIn('register', options);
          props.closeModal();
          break;

        case 'FAIL':
          console.log('Login fail response: ', res);
          if (res.reason === 'EMAIL_IN_USE')
            authData!.newRegistration.pushEmailValidationError(res.msg as string);

        case 'ERROR':
          console.log('Something wrong has happened: ', res);
      }
      stopLoading();
    } catch (err) {
      console.log('Error in fnAuthenticate: ', err);
    }
  };

  const handleSubmitCredentials: React.MouseEventHandler = function (ev) {
    const actionTaken = (ev.target as Element).closest('button')!.dataset.action as
      | 'save'
      | 'skip';

    let credentials: { [key: string]: any } = {
      firstName: authData!.newRegistration.firstName,
      lastName: authData!.newRegistration.lastName,
      email: authData!.newRegistration.email,
      password: authData!.newRegistration.password,
    };
    if (!!uploadedFile?.rawFile) credentials.photo = uploadedFile.rawFile; // If user uploaded from device

    if (actionTaken === 'skip') return authenticate(credentials);

    // Populate the credentials object if user clicked 'save and continue'
    if (facebookEmail) credentials.facebookEmail = facebookEmail; // If FB photo uploaded (we got also his email)
    if (uploadedFile?.url?.startsWith('https')) credentials.imgUrl = uploadedFile.url; // If user uploaded FB photo
    if (gender) credentials.gender = gender; // If user selected gender

    // If the birthday fields were all selected. They must be all selected
    if (Object.values(birthInfo).every(field => !!field)) credentials.birthInfo = birthInfo;

    authenticate(credentials);
  };

  const handleFacebookProfileSuccess = function (profile: any) {
    console.log('Facebook Profile success', profile);
    if (profile?.picture?.data?.url) setUploadedFile({ url: profile.picture.data.url });
    if (profile?.email) setFacebookEmail(profile.email);
  };

  return (
    <AuthContentWrapper
      contentTitle={`Welcome to localinspire, ${authData?.newRegistration.firstName}`}
      subtitle="Let others see who you are by completing the following"
    >
      <div className={styles.moreSignupDetails}>
        <div className={styles.photo}>
          <Image
            src={uploadedFile?.url || '/img/default-profile-pic.jpeg'}
            width={120}
            height={120}
            objectFit="cover"
          />
        </div>

        <div className={cls(styles.photoUploadStrategies, 'mt-3')}>
          <FacebookLogin
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!}
            onSuccess={resp => console.log('See response: ', resp)}
            onFail={err => console.log('Failed: ', err)}
            onProfileSuccess={handleFacebookProfileSuccess}
            className={cls(
              'btn btn-outline btn--sm w-100 mb-2 d-flex align-items-center',
              styles.btnSocial,
            )}
          >
            <FacebookIcon fontSize="large" />
            Use Facebook profile photo
          </FacebookLogin>

          <div
            className={cls(
              'btn btn-outline btn--sm btn-outline-sec-light p-1 py-0',
              styles.btnFileOpener,
            )}
          >
            <input
              type="file"
              id="new-photo"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleChangeFileInput}
            />
            <label
              className="btn d-flex gap-3 align-items-center font-inherit"
              htmlFor="new-photo"
            >
              <ComputerIcon fontSize="large" /> Upload from device
            </label>
          </div>
        </div>

        <div className={styles.birthday}>
          <Spinner show={isAuthenticating} />

          <h5 className="mb-0 fs-5 mb-2">Birthday</h5>
          <small className="parag mb-4 d-block fs-6" style={{ color: 'gray' }}>
            (Receive specials on your birthday)
          </small>

          <div className={cls(styles.birthdayFields, 'd-flex gap-2')}>
            <Dropdown>
              <Dropdown.Toggle>{birthInfo.year || 'Year'}</Dropdown.Toggle>
              <Dropdown.Menu>
                {yearsSince1940.map(yr => (
                  <Dropdown.Item
                    className="fs-4"
                    eventKey={yr}
                    key={yr}
                    onClick={changeBirthInfo.bind(null, 'year', yr)}
                  >
                    {yr}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle>{birthInfo.month || 'Month'}</Dropdown.Toggle>
              <Dropdown.Menu>
                {monthsOfTheYear.map(month => (
                  <Dropdown.Item
                    className="fs-4"
                    eventKey={month}
                    key={month}
                    onClick={changeBirthInfo.bind(null, 'month', month)}
                  >
                    {month}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle>
                {birthInfo?.day ? (birthInfo.day + '').padStart(2, '0') : 'Day'}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ overflowY: 'scroll' }}>
                {datesOfTheMonth.map(date => (
                  <Dropdown.Item
                    className="fs-4"
                    eventKey={date}
                    key={date}
                    onClick={changeBirthInfo.bind(null, 'day', date)}
                  >
                    {date}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className={styles.gender}>
          <h5 className="fs-5 mb-4">Gender</h5>
          <div className={cls(styles.genderOptions, 'd-flex gap-4')}>
            <label htmlFor="male">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={setGender.bind(null, 'male')}
              />
              <span className="fs-5">Male</span>
            </label>
            <label htmlFor="female">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={setGender.bind(null, 'female')}
              />
              <span className="fs-5">Female</span>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-pry d-flex align-items-center justify-content-center gap-4"
            data-action="save"
            onClick={handleSubmitCredentials}
          >
            <span className="text">Save and Continue</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-gray d-flex align-items-center justify-content-center gap-4"
            data-action="skip"
            onClick={handleSubmitCredentials}
            // disabled={isAuthenticating}
          >
            <span className="text">Skip</span>
          </button>
        </div>

        {/* <AuthNav goBack={props.goBack} /> */}
      </div>
    </AuthContentWrapper>
  );
};

export default MoreSignupDetails;
