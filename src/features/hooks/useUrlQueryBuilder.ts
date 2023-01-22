import { useEffect, useState } from 'react';

interface QueryProperties {
  match: { [key: string]: (string | number)[] };
  sort: (string | number)[];
  page: number;
}

interface Params {
  filtersConfig: Map<string, { [key: string]: string | number }>;
  autoBuild: boolean;
  onBuild?: (query: string) => void;
}

const useUrlQueryBuilder = function <T extends string>(params: Params) {
  const [queryStr, setQueryStr] = useState('');
  const [filterNames, setFilterNames] = useState<string[]>([]);

  const addNewFilterName = (filter: T) => {
    setFilterNames(filters => [filter, ...filters]);
  };
  const removeFilterName = (filter: T) => {
    setFilterNames(filters => filters.filter(f => f !== filter));
  };

  const triggerBuildQuery = () => {
    const queryProperties: QueryProperties = { match: {}, sort: [], page: 0 };

    filterNames.forEach((filterName, i) => {
      const querySpecification = params.filtersConfig.get(filterName)!;

      if ('sort' in querySpecification) {
        queryProperties.sort.push(querySpecification.sort!);
      } else {
        const [k, v] = Object.entries(querySpecification!).flat();
        if (!queryProperties.match[k]) queryProperties.match[k] = [v];
        else queryProperties.match[k].push(v);
      }
    });

    let queryStr = '?';

    for (let queryType in queryProperties) {
      switch (queryType) {
        case 'match':
          Object.keys(queryProperties[queryType]).map(k => {
            queryStr += `${k}=${queryProperties.match[k].join(',')}`;
            queryStr += '&';
          });
          break;
        case 'sort':
          if (!queryProperties.sort.length) continue;
          queryStr += `sort=${queryProperties.sort.join(',')}`;
          queryStr += '&';
          break;
      }
    }
    console.log(queryStr.slice(0, -1));
    setQueryStr(queryStr.slice(0, -1));
    params.onBuild?.(queryStr);
  };

  useEffect(() => {
    if (params.autoBuild) triggerBuildQuery();
  }, [filterNames]);

  return {
    queryStr,
    setQueryStr,
    triggerBuildQuery,
    filterNames,
    addNewFilterName,
    removeFilterName,
  };
};

export default useUrlQueryBuilder;
