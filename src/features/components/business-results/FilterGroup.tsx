import React, { useState, useEffect, useMemo, ChangeEvent, ChangeEventHandler } from 'react';
import { AdminFilter } from '../../types';
import useCounter from '../../hooks/useCounter';
import CustomAccordionToggle from '../shared/accordion/CustomAccordionToggle';
import cls from 'classnames';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Accordion, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import LabelledCheckbox from '../shared/LabelledCheckbox';

interface Props {
  f: AdminFilter;
  selectedFilters: string[];
  onChangeCheckbox: (ev: ChangeEvent<HTMLInputElement>, tag: string) => void;
  onChangeSelect: (ev: ChangeEvent<HTMLSelectElement>) => void;
  showFilterModal: (f: AdminFilter) => void;
  styles: { [key: string]: string };
}

const MAX_FILTERS_TO_REVEAL = 4;

const FiltersGroup = function (props: Props) {
  const { f, onChangeCheckbox, styles } = props;
  const {
    count: totalFiltersToShow,
    increment: expandAccordion,
    decrement: collapseAccordion,
    nextCount: nextFiltersCount,
  } = useCounter({
    init: MAX_FILTERS_TO_REVEAL,
    step: MAX_FILTERS_TO_REVEAL,
    min: MAX_FILTERS_TO_REVEAL,
    max: f.tags.length,
  });

  const shouldExpand = useMemo(
    () => f.tags.length > totalFiltersToShow,
    [f, totalFiltersToShow],
  );

  const handleToggleAccordion = () => {
    if (!shouldExpand) return collapseAccordion();
    if (nextFiltersCount <= 10) return expandAccordion();
    props.showFilterModal(f);
  };

  if (f.formType === 'dropdown')
    return (
      <div className={styles.filterSection} key={f._id}>
        <Form.Select className="textfield cursor-pointer" onChange={props.onChangeSelect}>
          <option value="select">{f.title}</option>
          {f.tags.map(tag => (
            <option key={tag}>{tag}</option>
          ))}
        </Form.Select>
      </div>
    );

  // if (f.formType === 'input') {
  //   return <>INPUT</>;
  // }

  return (
    <div className={styles.filterSection} key={f._id}>
      <Accordion className={styles.filterSection}>
        <h4 className="color-black fs-5 mb-3">{f.title}</h4>
        {f.tags.slice(0, totalFiltersToShow).map(tag => (
          <LabelledCheckbox
            label={tag}
            checked={props.selectedFilters.includes(tag)}
            onChange={ev => onChangeCheckbox(ev, tag)}
            className="fs-5 gap-2 mb-3"
            key={tag}
          />
        ))}

        <CustomAccordionToggle
          className={cls(
            'btn btn-bg-none no-bg-hover text-pry',
            f.tags.length <= MAX_FILTERS_TO_REVEAL && 'd-none',
          )}
          eventKey={f._id}
          onClick={handleToggleAccordion}
        >
          <Icon
            icon={`material-symbols:expand-${shouldExpand ? 'more' : 'less'}-rounded`}
            height={20}
          />
          <small>{shouldExpand ? 'Show more' : 'Show less'}</small>
        </CustomAccordionToggle>
      </Accordion>
    </div>
  );
};

export default FiltersGroup;
