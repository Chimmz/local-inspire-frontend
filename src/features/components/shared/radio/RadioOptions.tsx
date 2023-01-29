import cls from 'classnames';
import React, { ReactNode, useState } from 'react';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import styles from './RadioOptions.module.scss';

interface RadioProps {
  as: 'circle' | 'btn';
  options: Array<string | { label: ReactNode; value: string | number }>;
  layout?: 'block' | 'inline';
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  readonly?: boolean;
  validationError?: string;
}

function Radio(props: RadioProps) {
  const { options, layout = 'inline' } = props;
  const parentClassMap = { btn: styles.btnRadioOptions, circle: styles.circleRadioOptions };

  return (
    <>
      <Form.Control.Feedback type="invalid" className="d-block mb-2">
        {props.validationError}
      </Form.Control.Feedback>
      <div className={cls(parentClassMap[props.as], styles[layout])}>
        {options.map(optn => {
          const label = typeof optn === 'string' ? optn : optn.label;
          const value = typeof optn === 'string' ? optn : optn.value;

          const itemClassMap = {
            btn: 'btn btn-outline btn-lg',
            circle: cls(styles.circleRadioOptions),
          };

          return (
            <label htmlFor={String(value)} key={uuidv4()}>
              <input
                type="radio"
                id={String(value)}
                className={styles.radioInput}
                checked={props.value?.toLowerCase() === String(value).toLowerCase()}
                // checked
                name={props.name}
                value={value}
                onChange={!props.readonly ? props.onChange : () => {}}
              />
              <span
                className={itemClassMap[props.as]}
                style={{ pointerEvents: props.readonly ? 'none' : 'all' }}
              >
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </>
  );
}

export default Radio;
