import { useState } from 'react';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { ReactSelectOption } from '../components/admin/pages/filters/config';

const useReactSelect = () => {
  const [selectedItems, setSelectedItems] = useState<
    MultiValue<ReactSelectOption> | SingleValue<ReactSelectOption>
  >([]);

  const onSelect = (
    newState: MultiValue<ReactSelectOption> | SingleValue<ReactSelectOption>,
    action: ActionMeta<ReactSelectOption>,
  ) => {
    setSelectedItems(newState);
  };

  return { selectedItems, onSelect, setSelectedItems };
};

export default useReactSelect;
