import { AdminFilter } from '../../../../types';

export const tableColumns = [
  { name: 'Name', selector: (row: any) => row.name },
  { name: 'Title', selector: (row: any) => row.title },
  { name: 'Add/Edit Description', selector: (row: any) => row.description },
  { name: 'SIC2', selector: (row: any) => row.SIC2Categories },
  { name: 'SIC4', selector: (row: any) => row.SIC4Categories },
  { name: 'SIC8', selector: (row: any) => row.SIC8Categories },
  { name: 'Keyword', selector: (row: any) => row.searchKeywords },
  { name: 'Order', selector: (row: any) => row.keyOrder },
  { name: 'Type', selector: (row: any) => row.formType },
  { name: 'Show on business', selector: (row: any) => row.showForBusiness },
  { name: 'Show on filter', selector: (row: any) => row.showForFilter },
  { name: 'Active', selector: (row: any) => row.isActive },
  { name: 'Actions', selector: (row: any) => row.actions },
];

export interface ReactSelectOption {
  label: string;
  value: string;
}

export const getSelectOptions = (arr: string[] | undefined): ReactSelectOption[] => {
  if (!arr) return [];
  return arr.map(str => ({ label: str, value: str }));
};

export const searchKeywords = [
  'Restaurants',
  'Hotels',
  'Vacation Rentals',
  'Things to do',
  'Cruises',
];

export const formTypes = ['input', 'checkbox', 'dropdown', 'textarea', 'slider'];
