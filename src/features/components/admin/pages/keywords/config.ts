import { AdminFilter } from '../../../../types';

export const tableColumns = [
  { name: 'Name', selector: (row: any) => row.name },
  { name: 'SIC4', selector: (row: any) => row.sic4Categories },
  { name: 'Enable on business', selector: (row: any) => row.enableForBusiness },
  { name: 'Enable on filter', selector: (row: any) => row.enableForFilter },
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
