import cls from 'classnames';
import Image from 'next/image';
import React, { useEffect } from 'react';
import useDelayedActionUponTextInput from '../../../hooks/useDelayActionUponTextInput';
import useFileUploadsWithDescription, {
  ItemUpload,
} from '../../../hooks/useFileUploadsWithDescription';
import useInput from '../../../hooks/useInput';
import { isRequired } from '../../../utils/validators/inputValidators';
import TextInput from '../text-input/TextInput';
import styles from './UploadedItem.module.scss';

type Props = Pick<ItemUpload, 'id' | 'description' | 'img'> &
  Partial<ReturnType<typeof useFileUploadsWithDescription>>;

const UploadedItem = function (props: Props) {
  const { inputValue, handleChange, validationErrors, runValidators } = useInput({
    init: props.description || '',
    validators: [{ fn: isRequired, params: ['Please add a description'] }],
  });

  const handleInputKeyUp = useDelayedActionUponTextInput({
    delay: 200,
    action: () => {
      props.editUploadedItem!(props.id, 'description', inputValue.trim());
      // So that the validator is aware of the latest input.
      props.editUploadedItem!(props.id, 'validatorRunner', runValidators);
    },
  });

  // useEffect(() => {
  //   props.editUploadedItem!(props.id, 'description', inputValue);
  // }, [inputValue]);

  useEffect(() => {
    props.editUploadedItem!(props.id, 'validatorRunner', runValidators);
  }, []);

  return (
    <li className={cls(styles.item, 'position-relative')} key={props.id}>
      <Image
        src={props.img.url!}
        width={200}
        height={200}
        objectFit="cover"
        style={{ borderRadius: '3px' }}
      />
      <div className="flex-grow-1">
        <TextInput
          type="text"
          as="textarea"
          value={inputValue}
          onChange={handleChange}
          label="Photo description (required)"
          className="textfield w-100"
          validationErrors={validationErrors}
          onInput={ev => console.log(ev.target.value)}
          onKeyUp={handleInputKeyUp}
        />
      </div>
      <span
        onClick={props.deleteUpload!.bind(null, props.id)}
        style={{
          fontSize: '3rem',
          right: '1.2rem',
          top: '0px',
          cursor: 'pointer',
        }}
        className="position-absolute"
      >
        &times;
      </span>
    </li>
  );
};

export default UploadedItem;
