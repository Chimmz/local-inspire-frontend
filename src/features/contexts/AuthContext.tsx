import React, { useState, createContext, ReactNode, useContext } from 'react';
import { AuthType } from '../components/layout/navbar/Navbar';

interface AuthData {
  isAuthModalOpen: boolean;
  authType?: AuthType;
  showAuthModal?(authType: AuthType): void;
  closeAuthModal?(): void;
}

const AuthContext = createContext<AuthData>({ isAuthModalOpen: false });

const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userWantsToAuth, setUserWantsToAuth] = useState<{
    yes: boolean;
    authType: AuthType | undefined;
  }>({ yes: false, authType: undefined });

  const showAuthModal = (authType: AuthType) => {
    setUserWantsToAuth({ yes: true, authType });
  };
  const closeAuthModal = () => setUserWantsToAuth({ yes: false, authType: undefined });

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen: userWantsToAuth.yes,
        authType: userWantsToAuth.authType,
        showAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContextProvider;
