import React from 'react';
import * as uuid from 'uuid';
import cls from 'classnames';
import styles from './SearchResults.module.scss';

type Item = { label: React.ReactNode; value: string | number };
interface Props {
  show: boolean;
  resultItems: Item[];
  renderItem?: (item: Item) => JSX.Element;
  onSelectItem?: () => any;
  searchTerm: string;
}

function SearchResults(props: Props) {
  const { show, resultItems, renderItem, onSelectItem } = props;

  const boldenMatchesWithSearchTerm = (result: string) => {};

  if (!show) return <></>;
  return (
    <div className={cls(styles.searchSuggestions, 'thin-scrollbar')}>
      <ul>
        {resultItems?.map(
          item =>
            renderItem?.(item) || (
              <li key={uuid.v4()}>
                <a
                  href="#"
                  data-name="category"
                  data-value={item.value}
                  onClick={onSelectItem}
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}

export default SearchResults;
