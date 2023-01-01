import { useEffect } from 'react';

import cls from 'classnames';
import { Modal } from 'react-bootstrap';
import FileUploadPrompt from '../FileUploadPrompt';
import styles from './PhotoUploadsWithDescription.module.scss';
import UploadedItem from './UploadedItem';
import useFileUploadsWithDescription from '../../../hooks/useFileUploadsWithDescription';

type Props = ReturnType<typeof useFileUploadsWithDescription> & {
  show: boolean;
  close(): void;
};

function PhotoUploadsWithDescription({ show, close, ...mainProps }: Props) {
  const {
    uploadsData,
    pushNewUpload,
    editUploadedItem,
    deleteUpload,
    newFile,
    setNewFile,
    handleChangeFile,
  } = mainProps;

  useEffect(() => {
    if (!newFile?.length) return;
    pushNewUpload(newFile);
    setNewFile('');
  }, [newFile]);

  const handleContinue: React.MouseEventHandler<HTMLButtonElement> = async ev => {
    new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        const anyErrorsExists = uploadsData
          .map(upload => upload.validatorRunner?.())
          .some(result => result?.errorExists);
        (anyErrorsExists ? reject : resolve)(anyErrorsExists);
      }, 500);
    }).then(close);
  };

  useEffect(() => {
    const dialog = document.querySelector('.modal-dialog') as HTMLElement;
    if (dialog) dialog.style.maxWidth = '700px';
  }, []);

  return (
    <Modal
      show={show}
      onHide={close}
      centered
      scrollable={!!uploadsData.length}
      backdrop="static"
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: '#f8f9fa', fontSize: '1.3rem' }}
      >
        <Modal.Title>Add photos of Fannies BBQ</Modal.Title>
      </Modal.Header>

      <Modal.Body
        className=""
        style={{ backgroundColor: '#f8f9fa', fontSize: '1.3rem', padding: '2vw' }}
      >
        {uploadsData.length ? (
          <ul className={styles.items}>
            {uploadsData.map(item => (
              <UploadedItem
                id={item.id}
                photo={item.photo}
                description={item.description}
                editUploadedItem={editUploadedItem}
                deleteUpload={deleteUpload}
                key={item.id}
              />
            ))}
          </ul>
        ) : (
          <div className={cls(styles.uploadPrompt, 'xy-center')}>
            <FileUploadPrompt
              className="btn btn-pry btn--lg"
              onChange={handleChangeFile}
              // allowMultipleUploadsAtOnce
            >
              Upload photo from this device
            </FileUploadPrompt>
          </div>
        )}
      </Modal.Body>

      {uploadsData.length ? (
        <Modal.Footer className="justify-content-between">
          <FileUploadPrompt
            className="btn btn-sec"
            onChange={handleChangeFile}
            // allowMultipleUploadsAtOnce
          >
            Add another photo
          </FileUploadPrompt>

          <button className="btn btn-outline-gray" onClick={handleContinue}>
            Continue
          </button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}

export default PhotoUploadsWithDescription;
