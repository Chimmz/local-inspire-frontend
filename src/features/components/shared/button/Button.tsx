import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface ButtonProps {
  [key: string]: any;
  textWhileLoading?: React.ReactNode;
  children?: React.ReactNode;
  isLoading: boolean;
  disabled?: boolean;
  withSpinner?: boolean;
}

function LoadingButton(props: ButtonProps) {
  const { isLoading, disabled, withSpinner, textWhileLoading, children, ...otherProps } = props;

  return (
    <button
      {...otherProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        justifyContent: 'center',
      }}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          {withSpinner ? (
            <Spinner animation="border" style={{ borderWidth: '1px' }} role="status" />
          ) : null}
          <span className="d-flex align-items-center gap-2">
            {textWhileLoading || 'Loading...'}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default LoadingButton;
