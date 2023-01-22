import React, { ReactNode } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import cls from 'classnames';
import styles from './AppDropdown.module.scss';

interface DropdownProps {
  items: (string | number | { label: ReactNode; value: string | number })[];
  toggler: React.ReactNode;
  className?: string;
  onSelect(evKey: string): void;
  noDefaultIcon?: boolean;
}

const AppDropdown: React.FC<DropdownProps> = props => {
  const { items, noDefaultIcon = true } = props;

  const renderItems = () => {
    return items.map((item, i) => {
      const label = typeof item === 'object' ? item.label : item;
      const value = String(typeof item === 'object' ? item.value : item).toLowerCase();

      return (
        <Dropdown.Item eventKey={value} key={i}>
          {label}
        </Dropdown.Item>
      );
    });
  };

  return (
    <DropdownButton
      className={cls(
        styles.appDropdown,
        props.className,
        noDefaultIcon && styles.noDefaultIcon,
        'fs-5',
      )}
      // align="end"
      variant="outline-secondary"
      size="lg"
      title={props.toggler}
      onSelect={evKey => props.onSelect(evKey!)}
      // className="overflow-y-scroll thin-scrollbar"
    >
      {renderItems()}
    </DropdownButton>
  );
};

export default AppDropdown;
