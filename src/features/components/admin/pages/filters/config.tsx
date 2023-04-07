import { Icon } from '@iconify/react';
import { AdminFilter } from '../../../../types';
import { Dispatch, SetStateAction } from 'react';

export interface ReactSelectOption {
  label: string;
  value: string;
}

export const getSelectOptions = (arr: string[] | undefined): ReactSelectOption[] => {
  if (!arr) return [];
  return arr.map(str => ({ label: str, value: str }));
};

export const tableColumns = [
  { name: 'Name', selector: (row: any) => row.name },
  { name: 'Title', selector: (row: any) => row.title },
  { name: 'Add/Edit Description', selector: (row: any) => row.description },
  { name: 'SIC2', selector: (row: any) => row.SIC2Categories },
  { name: 'SIC4', selector: (row: any) => row.SIC4Categories },
  { name: 'SIC8', selector: (row: any) => row.SIC8Categories },
  { name: 'Keywords', selector: (row: any) => row.keywords },
  { name: 'Order', selector: (row: any) => row.keyOrder },
  { name: 'Type', selector: (row: any) => row.formType },
  { name: 'Show on business', selector: (row: any) => row.showForBusiness },
  { name: 'Show on filter', selector: (row: any) => row.showForFilter },
  { name: 'Active', selector: (row: any) => row.isActive },
  { name: 'Actions', selector: (row: any) => row.actions },
];

interface RowOptions {
  onEdit: Dispatch<SetStateAction<AdminFilter | null>>;
  onDelete: (f: AdminFilter) => void;
}

export const genFilterTableData = (filters: AdminFilter[] | undefined, rowOpts: RowOptions) => {
  if (!filters?.length) return [];

  const withTooltip = function <T>(data: T, stringify?: (data: T) => string | undefined) {
    if (!data) return '-';
    const dataStr = stringify?.(data) || (data as string);
    return <span title={dataStr}>{dataStr}</span>;
  };

  return filters.map(f => ({
    ...f,
    id: f._id,
    title: f.title || '-',
    description: <span title={f.description.text}>{f.description.text}</span>,
    showForBusiness: f.showForBusiness ? 'Yes' : 'No',
    showForFilter: f.showForFilter ? 'Yes' : 'No',
    isActive: f.isActive ? 'Yes' : 'No',
    SIC2Categories: withTooltip(f.SIC2Categories, data => data?.join(', ')),
    SIC4Categories: withTooltip(f.SIC4Categories, data => data?.join(', ')),
    SIC8Categories: withTooltip(f.SIC8Categories, data => data?.join(', ')),
    keywords: withTooltip(f?.keywords, data => data?.join(', ')),
    actions: (
      <div className="d-flex align-items-center gap-2 ">
        <Icon
          onClick={rowOpts.onEdit.bind(null, f)}
          icon="material-symbols:edit-outline-rounded"
          width={18}
          className="cursor-pointer"
          color="#555"
        />
        <Icon
          onClick={rowOpts.onDelete.bind(null, f)}
          icon="material-symbols:delete-outline"
          className="cursor-pointer"
          width={18}
          color="#555"
        />
      </div>
    ),
  }));
};

export const formTypes = ['input', 'checkbox', 'dropdown', 'textarea', 'slider'];
