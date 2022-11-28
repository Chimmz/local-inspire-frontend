import React, { useState, useEffect, useRef } from 'react';
import cls from 'classnames';
import { Icon } from '@iconify/react';
import AuthContentWrapper from './AuthContentWrapper';
import AuthNav from './AuthNav';
import useRequest from '../../hooks/useRequest';
import Spinner from '../shared/spinner/Spinner';
import styles from './Auth.module.scss';

interface Props {
  email?: string;
  promptMsg?: string;
  // errorMsg: string;
  loading: boolean;
  // onEnterCode: (code: string) => void;
  resendEmail: (() => void) | null;
  goBack: () => void;
  goNext?: () => void;
}

const EmailVerification = function (props: Props) {
  const { send: sendEmailVerification, loading: verifyingEmail } = useRequest({
    autoStopLoading: false,
  });

  const input1 = useRef<HTMLInputElement | null>(null);
  const input2 = useRef<HTMLInputElement | null>(null);
  const input3 = useRef<HTMLInputElement | null>(null);
  const input4 = useRef<HTMLInputElement | null>(null);

  const [enteredCode, setEnteredCode] = useState('');

  // useEffect(() => {
  //   if (enteredCode.length === 4) props.onEnterCode(enteredCode);
  // }, [enteredCode]);

  useEffect(() => {
    // input1.current!.focus();
    // [input1, input2, input3, input4].forEach((inp, i, arr) => {
    //   const nextInput = arr[i + 1];
    //   const isLastInput = i === arr.length - 1;
    //   inp.current!.oninput = () => {
    //     console.log('New input: ', inp.current!.value);
    //     if (inp.current!.value) setEnteredCode(code => code.concat(inp.current!.value));
    //     if (isLastInput && inp.current?.value)
    //       return !input1.current!.value && input1.current!.focus();
    //     inp.current?.value && !nextInput.current!.value && nextInput.current!.focus();
    //   };
    // });
  }, []);

  const emailPortionToBeHidden = props.email?.slice(3, props.email.indexOf('@'));

  return (
    <div className={styles.emailVerification}>
      <Icon
        icon="material-symbols:mark-email-read"
        width="100"
        height="100"
        color="#024180"
      />
      <p style={{ fontSize: '16px' }} className="text-dark">
        {props.promptMsg}
        {/* Please verify your email address. Enter the verification code that has been sent
        to{' '}
        <strong>
          {props.email.replace(
            emailPortionToBeHidden,
            '*'.repeat(emailPortionToBeHidden.length),
          )}
        </strong> */}
      </p>
      <Spinner show={props.loading} />
      <small
        className="mt-4 d-flex justify-content-center gap-2"
        style={{ fontSize: '15px' }}
      >
        Didn&apos;t receive email?
        <span className="link link-sec ml-5" onClick={() => props.resendEmail?.()!}>
          Resend
        </span>
      </small>
      {/* <div className={styles.inputs}>
        <input type="number" className="textfield" maxLength={1} ref={input1} />
        <input type="number" className="textfield" maxLength={1} ref={input2} />
        <input type="number" className="textfield" maxLength={1} ref={input3} />
        <input type="number" className="textfield" maxLength={1} ref={input4} />
      </div> */}
      {/* <button className="btn btn-pry">Continue</button> */}

      <AuthNav
        goBack={props.goBack && props.goBack}
        goNext={props.goNext && props.goNext}
      />
    </div>
  );
};

export default EmailVerification;
