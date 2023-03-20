import { RateableFeatures } from '../shared/feature-rating/types';
import { Icon } from '@iconify/react';
import { isRequired, mustNotBeSameAs } from '../../utils/validators/inputValidators';

export const featuresToRate: RateableFeatures = [
  { label: 'Food', icon: <Icon icon="zondicons:location-food" color="#2e2e2e" width={17} /> },
  { label: 'Value', icon: <Icon icon="oi:list-rich" color="#2e2e2e" /> },
  {
    label: 'Location',
    icon: (
      <Icon icon="typcn:location-arrow" color="#2e2e2e" style={{ transform: 'scale(1.5)' }} />
    ),
  },
  {
    label: 'Service',
    icon: <Icon icon="material-symbols:room-service-rounded" color="#2e2e2e" width={20} />,
  },
  { label: 'Atmosphere', icon: <Icon icon="mdi:spa" color="#2e2e2e" width={20} /> },
];

export const getVisitedPeriodValidators = (businessName: string) => {
  return [
    { fn: isRequired, params: [`Please specify when you visited ${businessName}`] },
    {
      fn: mustNotBeSameAs,
      params: ['Please select', `Please specify when you visited ${businessName}`],
    },
  ];
};
