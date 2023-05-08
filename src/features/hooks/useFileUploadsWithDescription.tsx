import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { ValidationFeedback } from '../utils/validators/types';
import useDeviceFileUpload, { FileUpload } from './useDeviceFileUpload';

export interface ItemUpload {
  img: FileUpload;
  description?: string;
  validatorRunner?(): { errorExists: boolean; errors: ValidationFeedback[] };
  id: string;
}

const useFileUploadsWithDescription = function (init: ItemUpload[] = []) {
  const [uploads, setUploads] = useState<ItemUpload[]>(init);

  const {
    uploadedFile: newFile,
    setUploadedFile: setNewFile,
    onChangeFile: handleChangeFile,
  } = useDeviceFileUpload({ type: 'image' });

  const pushNewUpload = (fileUpload: FileUpload) => {
    const newData: ItemUpload = { img: fileUpload, id: uuidv4(), description: '' };
    setUploads(prevData => [...prevData, newData]);
  };

  const editUploadedItem = function <F extends 'description' | 'validatorRunner'>(
    id: string,
    field: F,
    value: any,
    // value: F extends 'description' ? string : ValidationFeedback,
  ) {
    setUploads(data =>
      data.map(upload => {
        if (upload.id !== id) return upload;
        return { ...upload, [field]: value };
      }),
    );
  };

  const deleteUpload = (id: string) => {
    const filtered = uploads.filter(upload => upload.id !== id);
    setUploads(filtered);
  };

  return {
    uploads,
    pushNewUpload,
    editUploadedItem,
    deleteUpload,

    newFile,
    setNewFile,
    onChange: handleChangeFile,
  };
};

export default useFileUploadsWithDescription;
