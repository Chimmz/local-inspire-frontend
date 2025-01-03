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
  onSave?: () => void;
};

function PhotoUploadsWithDescription({ show, close, onSave, ...mainProps }: Props) {
  const {
    uploads,
    pushNewUpload,
    editUploadedItem,
    deleteUpload,
    newFile,
    setNewFile,
    onChange: handleChangeFile,
  } = mainProps;

  useEffect(() => {
    if (!newFile) return;
    pushNewUpload(newFile);
    setNewFile(null); // Reset the file str
  }, [newFile]); // Watch for when user uploads a new file

  const validateUploads = (runSave: boolean | undefined) => {
    new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        const errorsExists = uploads
          .map(upl => upl.validatorRunner?.())
          .some(result => result?.errorExists);

        (errorsExists ? reject : resolve)(errorsExists);
      }, 500);
    }).then(() => {
      close();
      if (runSave) onSave?.();
    });
  };

  useEffect(() => {
    const dialog = document.querySelector('.modal-dialog') as HTMLElement;
    if (dialog) dialog.style.maxWidth = '700px'; // Expand the modal a little
  }, []);

  return (
    <Modal
      show={show}
      onHide={validateUploads.bind(null, false)}
      centered
      scrollable={!!uploads.length}
      backdrop="static"
    >
      <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', fontSize: '1.3rem' }}>
        <Modal.Title>Add photos of Fannies BBQ</Modal.Title>
      </Modal.Header>

      <Modal.Body
        className=""
        style={{ backgroundColor: '#f8f9fa', fontSize: '1.3rem', padding: '2vw' }}
      >
        {uploads.length ? (
          <ul className={styles.items}>
            {uploads.map(item => (
              <UploadedItem
                id={item.id}
                img={item.img}
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

      {uploads.length ? (
        <Modal.Footer className="justify-content-between">
          <FileUploadPrompt
            className="btn btn-sec"
            onChange={handleChangeFile}
            // allowMultipleUploadsAtOnce
          >
            Add another photo
          </FileUploadPrompt>

          <button className="btn btn-outline-gray" onClick={validateUploads.bind(null, true)}>
            Continue
          </button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}

export default PhotoUploadsWithDescription;
