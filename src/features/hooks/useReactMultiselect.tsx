import { useState } from 'react';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { ReactSelectOption } from '../components/admin/pages/filters/config';

const useReactSelect = () => {
  const [chosenItems, setChosenItems] = useState<
    MultiValue<ReactSelectOption> | SingleValue<ReactSelectOption>
  >([]);

  const onSelect = (
    newState: MultiValue<ReactSelectOption> | SingleValue<ReactSelectOption>,
    action: ActionMeta<ReactSelectOption>,
  ) => {
    setChosenItems(newState);
  };
  return { chosenItems, onSelect };
};

export default useReactSelect;
