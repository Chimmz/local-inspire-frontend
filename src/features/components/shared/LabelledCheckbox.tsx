import { ReactNode, ChangeEventHandler, useMemo } from 'react';
import cls from 'classnames';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  label: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string | number;
  checked?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LabelledCheckbox: React.FC<Props> = function (props) {
  const checkId = useMemo(() => uuidv4(), []);
  return (
    <label
      htmlFor={checkId}
      className={cls(props.className, 'd-flex align-items-center gap-2 cursor-pointer')}
      style={props.style}
    >
      <Form.Check
        id={checkId}
        checked={props.checked}
        value={props.value}
        onChange={props.onChange}
        className="cursor-pointer"
      />
      {props.label}
    </label>
  );
};

export default LabelledCheckbox;
