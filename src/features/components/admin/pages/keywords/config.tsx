import { Icon } from '@iconify/react';
import { AdminSearchKeyword } from '../../../../types';

export interface ReactSelectOption {
  label: string;
  value: string;
}

interface RowConfig {
  onEdit: (k: AdminSearchKeyword) => void;
  onDelete: (k: AdminSearchKeyword) => void;
}

export const getSelectOptions = (arr: string[] | undefined): ReactSelectOption[] => {
  if (!arr) return [];
  return arr.map(str => ({ label: str, value: str }));
};

export const tableColumns = [
  { name: 'Name', selector: (row: any) => row.name },
  { name: 'SIC4', selector: (row: any) => row.sic4Categories },
  { name: 'Enable on filter', selector: (row: any) => row.enableForFilter },
  { name: 'Enable on business', selector: (row: any) => row.enableForBusiness },
  { name: 'Show on nav bar', selector: (row: any) => row.showOnNavbar },
  { name: 'Show for search', selector: (row: any) => row.showForSearch },
  { name: 'Actions', selector: (row: any) => row.actions },
];

export const genTableData = (keywords: AdminSearchKeyword[] | undefined, rowOpts: RowConfig) => {
  if (!keywords?.length) return [];

  return keywords.map(k => ({
    id: k._id,
    name: k.name,
    showOnNavbar: k.showOnNavbar ? 'Yes' : 'No',
    showForSearch: k.showForSearch ? 'Yes' : 'No',
    sic4Categories: k.sic4Categories?.join(', ') || '-',
    enableForBusiness: k.enableForBusiness ? 'Yes' : 'No',
    enableForFilter: k.enableForFilter ? 'Yes' : 'No',
    actions: (
      <div className="d-flex align-items-center gap-3 ">
        <Icon
          onClick={rowOpts.onEdit.bind(null, k)}
          icon="material-symbols:edit-outline-rounded"
          width={18}
          className="cursor-pointer"
          color="#555"
        />
        <Icon
          onClick={rowOpts.onDelete.bind(null, k)}
          icon="material-symbols:delete-outline"
          className="cursor-pointer"
          width={18}
          color="#555"
        />
      </div>
    ),
  }));
};

export const searchKeywords = [
  'Restaurants',
  'Hotels',
  'Vacation Rentals',
  'Things to do',
  'Cruises',
];

export const formTypes = ['input', 'checkbox', 'dropdown', 'textarea', 'slider'];
