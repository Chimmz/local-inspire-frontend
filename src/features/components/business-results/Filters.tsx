import { useState, useEffect, ChangeEvent, ChangeEventHandler } from 'react';
import { AdminFilter } from '../../types';

import { useRouter } from 'next/router';
import useList from '../../hooks/useList';
import useRequest from '../../hooks/useRequest';

import api from '../../library/api';
import cls from 'classnames';

import ExpandedFilterModal from './FiltersModal';
import FiltersGroup from './FilterGroup';

interface Props {
  onFilter: (sic8s: string[]) => any;
  pageParams: { category: string; city: string; stateCode: string };
  styles: { [key: string]: string };
}

const Filters = (props: Props) => {
  const [filters, setFilters] = useState<AdminFilter[] | undefined>();
  const [expandedFilter, setExpandedFilter] = useState<AdminFilter | null>(null);

  const { items: selectedFilters, addItem: addFilter, removeItem: removeFilter } = useList();
  const { send: sendFilterReq, loading: loadingFilters } = useRequest();
  const router = useRouter();

  useEffect(() => {
    const req = sendFilterReq(api.getFilters(props.pageParams.category));
    req.then(res => {
      if (res.status !== 'SUCCESS') return;

      const filters = (res.filters as AdminFilter[])
        .filter(f => f.showForFilter)
        .sort((prev, next) => {
          if (prev.keyOrder < next.keyOrder) return -1; // Sort by key order (asc)
          if (prev.keyOrder === next.keyOrder)
            return +new Date(prev.createdAt) - +new Date(next.createdAt); // OR Sort by creation date (asc)
          return 1;
        });
      setFilters(filters);
    });
  }, [router.asPath]); // Load filters on change window url

  const handleChangeCheckbox = (ev: ChangeEvent<HTMLInputElement>, tag: string) => {
    (ev.target.checked ? addFilter : removeFilter)(tag);
    const selectedFiltersSync = selectedFilters;
    ev.target.checked ? selectedFiltersSync.push(tag) : selectedFiltersSync.pop();
    props.onFilter(selectedFiltersSync);
  };

  const handleChangeSelect: ChangeEventHandler<HTMLSelectElement> = ev => {
    const prevValue = ev.target.dataset.previousValue;

    if (ev.target.value !== 'select') {
      addFilter(ev.target.value);
      let selectedFiltersSync: string[] = selectedFilters;
      selectedFiltersSync.push(ev.target.value);
      props.onFilter(selectedFiltersSync);
    }
    if (prevValue && prevValue !== 'select') removeFilter(prevValue); // Remove option previously selected
    ev.target.dataset.previousValue = ev.target.value; // Set dataset value to current value
  };

  return (
    <>
      <aside className={cls(props.styles.filter, 'thin-scrollbar')}>
        {filters?.map(f => (
          <FiltersGroup
            f={f}
            showFilterModal={(f: AdminFilter) => setExpandedFilter(f)}
            onChangeCheckbox={handleChangeCheckbox}
            onChangeSelect={handleChangeSelect}
            selectedFilters={selectedFilters}
            styles={props.styles}
            key={f._id}
          />
        ))}
      </aside>

      <ExpandedFilterModal
        show={!!expandedFilter}
        f={expandedFilter}
        onChangeCheckbox={handleChangeCheckbox}
        selectedFilters={selectedFilters}
        close={setExpandedFilter.bind(null, null)}
      />
    </>
  );
};

export default Filters;
