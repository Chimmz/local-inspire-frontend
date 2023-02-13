import {
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { BusinessProps } from '../components/business-results/Business';

const BusinessPageContext = createContext<
  | {
      business: BusinessProps | undefined;
      setBusiness: Dispatch<SetStateAction<BusinessProps | undefined>> | undefined;
    }
  | undefined
>(undefined);

export const BusinessPageContextProvider = (props: { children: ReactNode }) => {
  const [business, setBusiness] = useState<BusinessProps | undefined>();

  return (
    <BusinessPageContext.Provider
      value={{
        business,
        setBusiness,
      }}
    >
      {props.children}
    </BusinessPageContext.Provider>
  );
};

export const useBusinessPageContext = () => useContext(BusinessPageContext);
export default BusinessPageContext;
