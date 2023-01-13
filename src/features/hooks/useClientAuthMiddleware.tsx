import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import useSignedInUser from './useSignedInUser';

const useClientAuthMiddleware = function () {
  const currentUser = useSignedInUser();
  const { showAuthModal } = useAuthContext();
  const [nextAction, saveNextAction] = useState<Function | undefined>(undefined);
  const [nextActionExcecuted, setNextActionExcecuted] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentUser.isSignedIn && !nextActionExcecuted) {
      nextAction?.();
      setNextActionExcecuted(true);
    }
  }, [currentUser.isSignedIn]);

  return (next: Function) => {
    if (currentUser.isSignedIn) return next();
    saveNextAction(next);
    showAuthModal!('login');
  };
};

export default useClientAuthMiddleware;
