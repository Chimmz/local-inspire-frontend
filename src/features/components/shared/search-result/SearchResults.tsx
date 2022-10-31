import React from 'react';
import * as uuid from 'uuid';
import styles from './SearchResult.module.scss';

type Item = { name: string; value: string };
interface Props {
  show: boolean;
  resultItems?: Item[];
  renderItem?: (item: Item) => JSX.Element;
  onSelectItem?: () => any;
}

function SearchResults(props: Props) {
  const { show, resultItems, renderItem, onSelectItem } = props;

  if (!show) return <></>;
  return (
    <div className={styles.searchSuggestions}>
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
                  <span>{item.value}</span>
                </a>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}

export default SearchResults;
