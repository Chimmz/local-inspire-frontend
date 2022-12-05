import { useState } from 'react';

interface UploadProps {
  toUrl: boolean;
}

function useDeviceFileUpload({ toUrl }: UploadProps) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleChangeInput: React.ChangeEventHandler<HTMLInputElement> = ev => {
    const file = ev.target.files![0];
    if (toUrl) {
      const src = URL.createObjectURL(file);
      console.log({ src });
      return setUploadedFile(src);
    }
  };
  return { uploadedFile, setUploadedFile, handleChangeInput };
}

export default useDeviceFileUpload;
