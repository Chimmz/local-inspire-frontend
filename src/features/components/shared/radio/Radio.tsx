import cls from 'classnames';
import React, { ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Radio.module.scss';

interface RadioProps {
  as: 'circle' | 'btn';
  options: Array<string | { label: string; value: string }>;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function Radio(props: RadioProps) {
  const { options } = props;
  const classMap = { btn: styles.btnRadioOptions, circle: styles.circleRadioOptions };

  const renderRadioOption = function (label: string, value: string): ReactNode {
    const classMap = { btn: 'btn btn-outline btn-lg', circle: '' };

    return (
      <label htmlFor={value} key={uuidv4()}>
        <input
          type="radio"
          id={value}
          className={styles.radioInput}
          checked={props.value?.toLowerCase() === value.toLowerCase()}
          name={props.name}
          value={value}
          onChange={props.onChange}
        />
        <span className={classMap[props.as]}>{label}</span>
      </label>
    );
  };

  return (
    <div className={cls(classMap[props.as])}>
      {options.map(optn => {
        const label = typeof optn === 'string' ? optn : optn.label;
        const value = typeof optn === 'string' ? optn : optn.value;
        return renderRadioOption(label, value);
      })}
    </div>
  );
}

export default Radio;
