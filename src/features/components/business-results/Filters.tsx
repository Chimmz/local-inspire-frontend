import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminFilter } from '../../types';

import useToggle from '../../hooks/useToggle';
import { useRouter } from 'next/router';
import useCounter from '../../hooks/useCounter';
import useUrlQueryBuilder from '../../hooks/useUrlQueryBuilder';
import useList from '../../hooks/useList';
import useRequest from '../../hooks/useRequest';

import api from '../../library/api';
import cls from 'classnames';

import { Accordion } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import CustomAccordionToggle from '../shared/accordion/CustomAccordionToggle';
import LabelledCheckbox from '../shared/LabelledCheckbox';

interface Props {
  onFilter: (sic8s: string[]) => any;
  pageParams: { category: string; city: string; stateCode: string };
  styles: { [key: string]: string };
}

const MAX_FILTERS_TO_REVEAL = 7;

const Filters = (props: Props) => {
  const [filters, setFilters] = useState<AdminFilter[] | undefined>();
  const { items: selectedFilters, addItem: addFilter, removeItem: removeFilter } = useList();

  const { send: sendFilterReq, loading: loadingFilters } = useRequest();
  const router = useRouter();

  useEffect(() => {
    const req = api.getFilters(props.pageParams.category);
    sendFilterReq(req).then(res => res.status === 'SUCCESS' && setFilters(res.filters));
  }, [router.asPath]); // Load filters on new results page

  const handleToggleFilterCheckbox = (checked: boolean, f: AdminFilter) => {
    if (!f.SIC8Categories?.length) return;
    (checked ? addFilter : removeFilter)(f._id);

    const newFiltersSync = selectedFilters;
    checked ? newFiltersSync.push(f._id) : newFiltersSync.pop();
    props.onFilter(newFiltersSync);
  };

  return (
    <aside className={cls(props.styles.filter, 'thin-scrollbar')}>
      {filters?.map(f => (
        <FiltersGroup
          f={f}
          onToggleFilterCheckbox={handleToggleFilterCheckbox}
          styles={props.styles}
          key={f._id}
        />
      ))}
    </aside>
  );
};

interface FiltersGroupProps {
  f: AdminFilter;
  onToggleFilterCheckbox: (checked: boolean, f: AdminFilter) => void;
  styles: { [key: string]: string };
}

function FiltersGroup({ f, onToggleFilterCheckbox, styles }: FiltersGroupProps) {
  const {
    count: totalFiltersToShow,
    increment: incrementFiltersToShow,
    decrement: decrementFiltersToShow,
    isAtMax: isAtMaxCount,
    isAtMin: isAtMinCount,
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

  return (
    <div className={styles.filterSection} key={f._id}>
      <Accordion className={styles.filterSection}>
        {f.tags.slice(0, totalFiltersToShow).map(tag => (
          <LabelledCheckbox
            label={tag}
            onChange={ev => onToggleFilterCheckbox(ev.target.checked, f)}
            className="gap-2 mb-3"
            key={tag}
          />
        ))}

        <CustomAccordionToggle
          className={cls(
            'btn btn-bg-none no-bg-hover text-pry',
            f.tags.length <= MAX_FILTERS_TO_REVEAL && 'd-none',
          )}
          eventKey={f._id}
          onClick={shouldExpand ? incrementFiltersToShow : decrementFiltersToShow}
        >
          <Icon
            icon={`material-symbols:expand-${shouldExpand ? 'more' : 'less'}-rounded`}
            height={20}
          />
          {shouldExpand ? 'Show more' : 'Show less'}
        </CustomAccordionToggle>
      </Accordion>
    </div>
  );
}

export default Filters;
