import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import styles from './AppDropdown.module.scss';

type Item = string | number | { label: string; value: string | number };

interface DropdownProps<I extends Item> {
  items: I[];
  onSelect(evKey: string): void;
}

const AppDropdown: React.FC<DropdownProps<Item>> = props => {
  const { items } = props;

  const renderItems = () => {
    return items.map((item, i) => {
      const label = typeof item === 'object' ? item.label : item;
      const value = typeof item === 'object' ? item.value : item;

      return (
        <Dropdown.Item eventKey={value} active={i === 1} key={i} className="d-itemd">
          {label}
        </Dropdown.Item>
      );
    });
  };

  return (
    <DropdownButton
      className={styles.appDropdown}
      variant="outline-secondary"
      size="lg"
      title={'Location'}
      onSelect={evKey => props.onSelect(evKey!)}
      // className="overflow-y-scroll thin-scrollbar"
    >
      {renderItems()}
    </DropdownButton>
  );
};

export default AppDropdown;
