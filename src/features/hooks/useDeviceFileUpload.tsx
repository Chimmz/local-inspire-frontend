import { useState } from 'react';

interface UploadProps {
  toUrl: boolean;
  multiple?: boolean;
}

function useDeviceFileUpload({ multiple = false, toUrl = true }: UploadProps) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleChangeInput: React.ChangeEventHandler<HTMLInputElement> = ev => {
    const file = ev.target.files![0];
    console.log(ev.target.files);

    if (toUrl) {
      // const imgUrls = Array.from(files).map(URL.createObjectURL).join(' ');
      const imgUrl = URL.createObjectURL(file);
      setUploadedFile(imgUrl);
    }
  };

  return { uploadedFile, setUploadedFile, handleChangeInput };
}

export default useDeviceFileUpload;
