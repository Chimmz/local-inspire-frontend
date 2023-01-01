import { ReactNode } from 'react';

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  allowedFileTypes?: string[];
  allowMultipleUploadsAtOnce?: boolean;
  children?: ReactNode;
  className?: string;
  inputId?: string;
}

const FileUploadPrompt = function (props: Props) {
  const {
    onChange: handleUpload,
    allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'],
    allowMultipleUploadsAtOnce = false,
    ...otherProps
  } = props;

  return (
    <label htmlFor="file-upload">
      <div className={otherProps.className}>{otherProps.children}</div>
      <input
        id={otherProps.inputId || 'file-upload'}
        type="file"
        name="file-upload"
        accept={allowedFileTypes?.join(' ').trim()}
        onChange={handleUpload}
        style={{ display: 'none' }}
        multiple={allowMultipleUploadsAtOnce}
      />
    </label>
  );
};

export default FileUploadPrompt;
