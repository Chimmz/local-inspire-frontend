import cls from 'classnames';
import { ReactNode, ChangeEventHandler } from 'react';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  label: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const LabelledCheckbox: React.FC<Props> = function (props) {
  const checkId = uuidv4();

  return (
    <label
      htmlFor={checkId}
      className={cls(props.className, 'd-flex align-items-center gap-2')}
      style={props.style}
    >
      <Form.Check id={checkId} value={props.value} onChange={props.onChange} />
      {props.label}
    </label>
  );
};

export default LabelledCheckbox;
