import React, { ChangeEvent } from 'react';
import cls from 'classnames';
import { Modal } from 'react-bootstrap';
import { AdminFilter } from '../../types';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import styles from './ExpandedFilterModal.module.scss';
import useList from '../../hooks/useList';

interface Props {
  show: boolean;
  f: AdminFilter | null;
  onChangeCheckbox: (ev: ChangeEvent<HTMLInputElement>, tag: string) => void;
  selectedFilters: string[];
  close: () => void;
}

const FiltersModal = (props: Props) => {
  return (
    <Modal show={props.show} onHide={props.close} size="lg">
      <Modal.Header className="p-5" style={{ border: 'none' }} closeButton>
        <h2>{props.f?.title}</h2>
      </Modal.Header>
      <Modal.Body className="ps-5 ">
        <div className={cls(styles.filters, 'thin-scrollbar  w-100')}>
          {props.f?.tags.map(tag => (
            <LabelledCheckbox
              label={tag}
              checked={props.selectedFilters.includes(tag)}
              onChange={ev => props.onChangeCheckbox(ev, tag)}
              className="w-max-content gap-2 mb-3"
              key={tag}
            />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <button
          className="btn btn-pry btn--lg ms-auto"
          onClick={props.close}
          // disabled={props.f?.tags && props.f?.tags.some(props.selectedFilters.includes)}
        >
          Apply
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default FiltersModal;
