import { useEffect, useMemo, useState } from 'react';
import { AdminFilter } from '../../types';
import api from '../../library/api';
import useRequest from '../../hooks/useRequest';
import { useRouter } from 'next/router';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import useUrlQueryBuilder from '../../hooks/useUrlQueryBuilder';
import useList from '../../hooks/useList';

interface Props {
  onFilter: (sic8s: string[]) => any;
  pageParams: { category: string; city: string; stateCode: string };
  styles: { [key: string]: string };
}

const Filters = (props: Props) => {
  const [filters, setFilters] = useState<AdminFilter[] | undefined>();
  const { items: selectedFilters, addItem: addFilter, removeItem: removeFilter } = useList();

  const { send: sendFilterReq, loading: loadingFilters } = useRequest();
  const router = useRouter();

  // const normalizedFilters = useMemo(() => {
  //   if (!filters) return {};
  //   let hashmap: { [filterTitle: string]: AdminFilter[] } = {};

  //   filters.forEach(f => {
  //     if (f.title in hashmap) hashmap[f.title].push(f);
  //     else hashmap[f.title] = [f];
  //   });
  //   return hashmap;
  // }, [filters]);

  const handleToggleFilter = (checked: boolean, f: AdminFilter) => {
    if (!f.SIC8Categories?.length) return;
    (checked ? addFilter : removeFilter)(f._id);

    const newFiltersSync = selectedFilters;
    checked ? newFiltersSync.push(f._id) : newFiltersSync.pop();
    props.onFilter(newFiltersSync);
  };

  useEffect(() => {
    const req = api.getFilters(props.pageParams.category);
    sendFilterReq(req).then(res => res.status === 'SUCCESS' && setFilters(res.filters));
  }, [router.asPath]);

  // useEffect(() => {
  //   props.onFilter(selectedFilters);
  // }, [selectedFilters]);

  return (
    <aside className={props.styles.filter}>
      {filters?.map(f => (
        <div className={props.styles.filterSection} key={f.name}>
          <h6 className={props.styles.filterTitle}>{f.title}</h6>
          {f.tags.map(tag => (
            <LabelledCheckbox
              label={tag}
              onChange={ev => handleToggleFilter(ev.target.checked, f)}
              className="gap-2"
              key={tag}
            />
          ))}
        </div>
      ))}
      {/* {Object.keys(normalizedFilters).map(title => (
        <div className={props.styles.filterSection} key={title}>
          <h6 className={props.styles.filterTitle}>{title}</h6>

          {normalizedFilters[title].map(filter => (
            <LabelledCheckbox
              label={filter.name}
              onChange={ev => handleToggleFilter(ev.target.checked, filter)}
              className="gap-2"
              key={filter._id}
            />
          ))}
        </div>
      ))} */}
    </aside>
  );
};

export default Filters;
