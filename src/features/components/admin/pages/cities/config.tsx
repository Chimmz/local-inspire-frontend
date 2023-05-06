import { Icon } from '@iconify/react';
import { City } from '../../../../types';
import Image from 'next/image';
import { Form, Spinner } from 'react-bootstrap';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import useRequest from '../../../../hooks/useRequest';
import useSignedInUser from '../../../../hooks/useSignedInUser';
import api from '../../../../library/api';
import useToggle from '../../../../hooks/useToggle';

export interface ReactSelectOption {
  label: string;
  value: string;
}

interface RowConfig {
  onEdit: (cityId: string) => void;
  onDelete: (cityId: string) => void;
}

interface CityActionsProps extends RowConfig {
  city: City;
  featured: boolean;
}

export const getSelectOptions = (arr: string[] | undefined): ReactSelectOption[] => {
  if (!arr) return [];
  return arr.map(str => ({ label: str, value: str }));
};

export const citiesColumns = [
  { name: 'Name', selector: (row: any) => row.name },
  { name: 'Image', selector: (row: any) => row.imgUrl },
  { name: 'State', selector: (row: any) => row.stateName },
  { name: 'Featured', selector: (row: any) => row.isFeatured },
  { name: 'Searches', selector: (row: any) => row.searches },
  { name: 'Actions', selector: (row: any) => row.actions },
];

export const genCitiesTableData = (cities: City[] | undefined, rowConfig: RowConfig) => {
  if (!Array.isArray(cities)) return [];
  return cities.map(city => ({
    id: city._id,
    name: city.name,
    stateName: city.stateName,
    isFeatured: city.isFeatured ? 'Yes' : 'No',
    searches: city.searchesCount,
    imgUrl: <Image src={city.imgUrl} width={300} height={170} objectFit="cover" />,
    actions: <CityActions city={city} featured={city.isFeatured} {...rowConfig} />,
  }));
};

const CityActions = function (props: CityActionsProps) {
  const { state: isFeatured, toggle: toggleFeatured } = useToggle(props.featured);
  const { send: sendToggleReq, loading: isToggling } = useRequest();
  const currentUser = useSignedInUser();

  const handleSwitchFeatured = () => {
    const req = api.toggleCityFeatured(props.city._id, currentUser.accessToken!);
    sendToggleReq(req).then(res => res.status === 'SUCCESS' && toggleFeatured());
  };
  return (
    <div className="d-flex align-items-center">
      <Icon
        onClick={props.onEdit.bind(null, props.city._id)}
        icon="material-symbols:edit-outline-rounded"
        width={19}
        className="cursor-pointer "
        color="#777"
      />
      <Switch
        checked={isFeatured}
        onChange={handleSwitchFeatured}
        disabled={isToggling}
        id={props.city._id}
        inputProps={{ 'aria-label': 'controlled' }}
        size="small"
        title={`Make ${props.city.name} ${props.city.isFeatured ? 'non-' : ''}featured`}
      />
      <Icon
        onClick={props.onDelete.bind(null, props.city._id)}
        icon="material-symbols:delete-outline"
        className="cursor-pointer"
        width={19}
        color="#777"
      />
    </div>
  );
};
