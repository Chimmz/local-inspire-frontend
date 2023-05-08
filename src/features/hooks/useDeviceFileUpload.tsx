import { useEffect, useState } from 'react';

interface UploadProps {
  // toUrl?: boolean;
  type?: 'image';
  multiple?: boolean;
}

export type FileUpload = { rawFile?: File; url?: string };

function useDeviceFileUpload(props: UploadProps) {
  const [uploadedFile, setUploadedFile] = useState<FileUpload | null>(null);

  useEffect(() => {
    console.log('Raw file: ', uploadedFile?.rawFile);
  }, [uploadedFile?.rawFile]);

  useEffect(() => {
    console.log({ uploadedFile });
  }, [uploadedFile]);

  const onChangeFile: React.ChangeEventHandler<HTMLInputElement> = ev => {
    const file = ev.target.files![0];
    if (!file) return;
    // const imgUrls = Array.from(files).map(URL.createObjectURL).join(' ');

    setUploadedFile({
      rawFile: file,
      url: props.type === 'image' ? URL.createObjectURL(file) : undefined,
    });
  };

  return { uploadedFile, setUploadedFile, onChangeFile };
}

export default useDeviceFileUpload;
