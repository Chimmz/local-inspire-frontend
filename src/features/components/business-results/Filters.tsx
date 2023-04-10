import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { AdminFilter } from '../../types';

import { useRouter } from 'next/router';
import useList from '../../hooks/useList';
import useRequest from '../../hooks/useRequest';

import api from '../../library/api';
import cls from 'classnames';

import LabelledCheckbox from '../shared/LabelledCheckbox';
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
    const req = api.getFilters(props.pageParams.category);
    sendFilterReq(req).then(res => res.status === 'SUCCESS' && setFilters(res.filters));
  }, [router.asPath]); // Load filters on new results page

  const handleChangeCheckbox = (ev: ChangeEvent<HTMLInputElement>, tag: string) => {
    (ev.target.checked ? addFilter : removeFilter)(tag);
    const selectedFiltersSync = selectedFilters;
    ev.target.checked ? selectedFiltersSync.push(tag) : selectedFiltersSync.pop();
    props.onFilter(selectedFiltersSync);
  };

  return (
    <>
      <aside className={cls(props.styles.filter, 'thin-scrollbar')}>
        {filters?.map(f => (
          <FiltersGroup
            f={f}
            showFilterModal={(f: AdminFilter) => setExpandedFilter(f)}
            onChangeCheckbox={handleChangeCheckbox}
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
