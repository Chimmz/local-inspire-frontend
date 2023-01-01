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
  const [uploadsData, setUploadsData] = useState<ItemUpload[]>(init);

  const {
    uploadedFile: newFile,
    setUploadedFile: setNewFile,
    handleChangeInput: handleChangeFile,
  } = useDeviceFileUpload({ toUrl: true, multiple: true });

  const pushNewUpload = (photo: string) => {
    const newData: ItemUpload = { photo, id: uuidv4(), description: '' };
    setUploadsData(prevData => [...prevData, newData]);
  };

  const editUploadedItem = function <F extends 'description' | 'validatorRunner'>(
    id: string,
    field: F,
    value: any,
    // value: F extends 'description' ? string : ValidationFeedback,
  ) {
    setUploadsData(data =>
      data.map(upload => {
        if (upload.id !== id) return upload;
        return { ...upload, [field]: value };
      }),
    );
  };

  const deleteUpload = (id: string) => {
    const filtered = uploadsData.filter(upload => upload.id !== id);
    setUploadsData(filtered);
  };

  return {
    uploadsData,
    pushNewUpload,
    editUploadedItem,
    deleteUpload,

    newFile,
    setNewFile,
    handleChangeFile,
  };
};

export default useFileUploadsWithDescription;
