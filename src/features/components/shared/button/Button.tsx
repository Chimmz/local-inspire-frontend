import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface ButtonProps {
  [key: string]: any;
  contentWhileLoading?: React.ReactNode;
  children?: React.ReactNode;
  isLoading: boolean;
}

function LoadingButton({ isLoading, ...otherProps }: ButtonProps) {
  return (
    <Button
      {...otherProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        justifyContent: 'center',
      }}
      disabled={isLoading}
    >
      <>
        {isLoading ? (
          <>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <span>Loading...</span>
          </>
        ) : (
          otherProps.children
        )}
      </>
    </Button>
  );
}

export default LoadingButton;
