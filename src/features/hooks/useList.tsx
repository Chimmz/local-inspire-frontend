import React, { useState } from 'react';

const useList = function <T = string>(initItems?: T[]) {
  const [items, setItems] = useState<T[]>(initItems || []);

  const addItem = (newItem: T) => setItems(items => [...items, newItem]);

  const removeItem = (itemToRemove: T, filterFn?: (item: T) => boolean) => {
    setItems(items => {
      return items.filter(item => filterFn?.(item) || item !== itemToRemove);
    });
  };

  return {
    items,
    addItem,
    removeItem,
  };
};

export default useList;
