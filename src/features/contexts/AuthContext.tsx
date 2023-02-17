import React, {
  useState,
  createContext,
  ReactNode,
  useContext,
  SetStateAction,
  Dispatch,
} from 'react';
import { AuthType } from '../components/layout/navbar/Navbar';

interface AuthData {
  isAuthModalOpen: boolean;
  authType?: AuthType;
  authTitle?: string;
  authSubtitle?: string;
  setAuthSubtitle?: Dispatch<SetStateAction<string>>;
  setAuthTitle?: Dispatch<SetStateAction<string>>;
  showAuthModal?(authType: AuthType): void;
  closeAuthModal?(): void;
}

const AuthContext = createContext<AuthData>({ isAuthModalOpen: false });

const AuthModalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userWantsToAuth, setUserWantsToAuth] = useState<{
    yes: boolean;
    authType: AuthType | undefined;
  }>({ yes: false, authType: undefined });

  const [authTitle, setAuthTitle] = useState('');
  const [authSubtitle, setAuthSubtitle] = useState('');

  const [showAuthModal, closeAuthModal] = [
    (authType: AuthType) => setUserWantsToAuth({ yes: true, authType }),
    setUserWantsToAuth.bind(null, { yes: false, authType: undefined }),
  ];

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen: userWantsToAuth.yes,
        authType: userWantsToAuth.authType,
        authTitle,
        setAuthTitle,
        authSubtitle,
        setAuthSubtitle,
        showAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthModalContext = () => useContext(AuthContext);
export default AuthModalContextProvider;
