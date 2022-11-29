import React, { useState } from 'react';
import Image from 'next/image';
import { signIn, SignInOptions, SignInResponse } from 'next-auth/react';

import { useAuthContext } from '../../../contexts/AuthContext';
import useRequest from '../../../hooks/useRequest';
import {
  datesOfTheMonth,
  monthsOfTheYear,
  yearsSince1940,
} from '../../../data/constants';

import LoadingButton from '../../shared/button/Button';
import AuthContentWrapper from '../AuthContentWrapper';
import FacebookIcon from '@mui/icons-material/Facebook';
import ComputerIcon from '@mui/icons-material/Computer';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
// import { Spinner } from 'react-bootstrap';
import Spinner from '../../shared/spinner/Spinner';
import cls from 'classnames';
import styles from '../Auth.module.scss';
import AuthNav from '../AuthNav';

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
  const authData = useAuthContext();
  const [uploadedPhoto, setUploadedPhoto] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    year: null,
    month: '',
    day: null,
  });
  const { send: sendSignupRequest, loading: isAuthenticating } = useRequest({
    autoStopLoading: true,
  });

  const changeBirthInfo = (
    field: 'day' | 'month' | 'year',
    newValue: string | number,
  ) => {
    setBirthInfo(info => ({ ...info, [field]: newValue }));
  };

  async function authenticate(credentials: object) {
    const options: SignInOptions = { ...credentials, redirect: false };
    console.log(credentials);
    // const spin5s = () => new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // const result = await sendSignupRequest(spin5s());
    try {
      const result = await sendSignupRequest(signIn('register', options));
      console.table(result);
      const { ok, error, status, url } = result;
      if (ok) return props.closeModal();

      const response = JSON.parse(error);
      switch (response.reason) {
        case 'EMAIL_IN_USE':
          authData?.newRegistration.pushEmailValidationError(response.msg);
          props.goBack();
          break;
      }
    } catch (err) {
      console.log('Credential signin Error: ', err);
    }
  }

  const handleSubmitCredentials: React.MouseEventHandler = ev => {
    const actionTaken = (ev.target as Element).closest('button')!.dataset.action as
      | 'save'
      | 'skip';

    let credentials: { [key: string]: any } = {
      firstName: authData!.newRegistration.firstName,
      lastName: authData!.newRegistration.lastName,
      email: authData!.newRegistration.email,
      password: authData!.newRegistration.password,
    };
    if (actionTaken === 'skip') return authenticate(credentials);

    if (uploadedPhoto) credentials.imgUrl = uploadedPhoto;
    if (gender) credentials.gender = gender;

    if (Object.values(birthInfo).every(field => !!field))
      credentials.birthInfo = birthInfo;
    authenticate(credentials);
    // props.closeModal();
  };

  const handleUploadPhoto: React.ChangeEventHandler<HTMLInputElement> = ev => {
    const file = ev.target.files![0];
    // const reader = new FileReader();

    // reader.onloadend = function () {
    //   console.log('RESULT: ', reader.result);
    //   setUploadedPhoto(reader.result as string);
    // };
    // reader.readAsDataURL(file);

    const src = URL.createObjectURL(file);
    setUploadedPhoto(src);
    console.log({ src });
  };

  return (
    <AuthContentWrapper
      contentTitle={`Welcome to localinspire, ${authData?.newRegistration.firstName}`}
      subtitle="Let others see who you are by completing the following"
    >
      <div className={styles.moreSignupDetails}>
        <div className={styles.photo}>
          <Image
            src={uploadedPhoto || '/img/default-profile-pic.jpeg'}
            width={150}
            height={150}
            objectFit="cover"
          />
        </div>

        <div className={cls(styles.photoUploadStrategies, 'mt-3')}>
          {/* <button
              type="button"
              className={cls(
                'btn btn-pry btn--sm w-100 mb-2 d-flex align-items-center',
                styles.btnSocial,
              )}
              onClick={() => {}}
              // isLoading={false}
              disabled={false}
            >
              <FacebookIcon fontSize="large" />
              <span className="text">Use Facebook photo</span>
            </button> */}

          <div
            className={cls(
              'btn btn-outline btn-outline-sec-light p-1 py-0',
              styles.btnFileOpener,
            )}
          >
            <input
              type="file"
              id="new-photo"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleUploadPhoto}
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

          <h5 className="mb-0 fs-4 mb-2">Birthday</h5>
          <small className="parag mb-4 d-block" style={{ color: 'gray' }}>
            Receive specials on your birthday
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
              <Dropdown.Menu>
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
          <h5 className="fs-4 mb-4">Gender</h5>
          <div className={cls(styles.genderOptions, 'd-flex gap-4')}>
            <label htmlFor="male">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={setGender.bind(null, 'male')}
              />
              <span>Male</span>
            </label>
            <label htmlFor="female">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={setGender.bind(null, 'female')}
              />
              <span>Female</span>
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

        <AuthNav goBack={props.goBack} />
      </div>
    </AuthContentWrapper>
  );
};

export default MoreSignupDetails;
