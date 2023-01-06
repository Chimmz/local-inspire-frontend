import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { ValidationFeedback } from '../utils/validators/types';
import useDeviceFileUpload from './useDeviceFileUpload';

export interface ItemUpload {
  photo: string;
  description?: string;
  validatorRunner?(): { errorExists: boolean; errors: ValidationFeedback[] };
  id: string;
}

const useFileUploadsWithDescription = function (init: ItemUpload[] = []) {
  const [uploads, setUploads] = useState<ItemUpload[]>(init);

  const {
    uploadedFile: newFile,
    setUploadedFile: setNewFile,
    handleChangeInput: handleChangeFile,
  } = useDeviceFileUpload({ toUrl: true, multiple: true });

  const pushNewUpload = (photo: string) => {
    const newData: ItemUpload = { photo, id: uuidv4(), description: '' };
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
    handleChangeFile,
  };
};

export default useFileUploadsWithDescription;
