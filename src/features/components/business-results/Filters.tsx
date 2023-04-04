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
  const {
    items: selectedFilters,
    addItem: addFilter,
    removeItem: removeFilter,
  } = useList<string>();

  const { send: sendFilterReq, loading: loadingFilters } = useRequest();
  const router = useRouter();

  const normalizedFilters = useMemo(() => {
    if (!filters) return {};
    let hashmap: { [filterTitle: string]: AdminFilter[] } = {};

    filters.forEach(f => {
      if (f.title in hashmap) hashmap[f.title].push(f);
      else hashmap[f.title] = [f];
    });
    return hashmap;
  }, [filters]);

  const handleCheckFilter = (checked: boolean, filter: AdminFilter) => {
    if (!filter.SIC8Categories?.length) return;
    (checked ? addFilter : removeFilter)(filter._id);
  };

  useEffect(() => {
    const req = api.getFilters(props.pageParams.category);
    sendFilterReq(req).then(res => res.status === 'SUCCESS' && setFilters(res.filters));
  }, [router.asPath]);

  useEffect(() => {
    props.onFilter(selectedFilters);
  }, [selectedFilters]);

  return (
    <aside className={props.styles.filter}>
      {Object.keys(normalizedFilters).map(title => (
        <div className={props.styles.filterSection} key={title}>
          <h6 className={props.styles.filterTitle}>{title}</h6>

          {/* Now display the filter names */}
          {normalizedFilters[title].map(filter => (
            <LabelledCheckbox
              label={filter.name}
              onChange={ev => handleCheckFilter(ev.target.checked, filter)}
              className="gap-2"
              key={filter._id}
            />
          ))}
        </div>
      ))}

      {/* <label htmlFor="Restaurants">
          <input type="checkbox" id="Restaurants" />
          <span>Restaurants</span>
        </label>

        <label htmlFor="Bakeries">
          <input type="checkbox" id="Bakeries" />
          <span>Bakeries</span>
        </label>

        <label htmlFor="Delivery Only">
          <input type="checkbox" id="Delivery Only" />
          <span>Delivery Only</span>
        </label> */}
    </aside>
  );
};

export default Filters;
