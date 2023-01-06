import cls from 'classnames';
import { ReactNode, ChangeEventHandler, forwardRef, Ref } from 'react';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  label: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string | number;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

const LabelledCheckbox: React.FC<Props> = forwardRef(function (props, ref) {
  const checkId = uuidv4();

  return (
    <label
      htmlFor={checkId}
      className={cls(props.className, 'd-flex align-items-center gap-2')}
    >
      <Form.Check id={checkId} value={props.value} onChange={props.onChange} ref={ref} />
      {props.label}
    </label>
  );
});

export default LabelledCheckbox;
