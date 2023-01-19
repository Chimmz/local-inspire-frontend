import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import useSignedInUser from './useSignedInUser';

export type MiddlewareNextAction = (...args: []) => any;
export type AuthMiddlewareNextAction = (token: string) => any;

type Middleware = (next: AuthMiddlewareNextAction) => any;

const useClientAuthMiddleware = function () {
  const currentUser = useSignedInUser();
  const { showAuthModal, isAuthModalOpen } = useAuthContext();

  const [nextAction, setNextAction] = useState<AuthMiddlewareNextAction | undefined>(
    undefined,
  );
  const [middlewareType, setMiddlewareType] = useState<'AUTH' | null>(null);

  const removeNextAction = () => {
    setNextAction(undefined);
    setMiddlewareType(null);
  };

  useEffect(() => {
    if (middlewareType === 'AUTH' && currentUser.isSignedIn) {
      nextAction?.(currentUser.accessToken!);
      removeNextAction(); // Reset next action since it is already executed
    }
  }, [currentUser.isSignedIn]);

  useEffect(() => {
    // If user closes the auth modal without signing in
    if (!isAuthModalOpen && middlewareType === 'AUTH') removeNextAction();
  }, [isAuthModalOpen]);

  const withAuth: Middleware = function (next: AuthMiddlewareNextAction) {
    setMiddlewareType('AUTH');
    if (currentUser.isSignedIn) return next(currentUser.accessToken!); // Proceed if logged in

    showAuthModal!('login');
    setNextAction(() => next); // Cache the next function that will be run once user signs in
  };

  return { withAuth };
};

export default useClientAuthMiddleware;
