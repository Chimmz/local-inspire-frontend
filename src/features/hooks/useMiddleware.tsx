import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAuthModalContext } from '../contexts/AuthContext';
import useSignedInUser from './useSignedInUser';

export type MiddlewareNext = (...args: []) => any;
export type AuthMiddlewareNext = (token: string) => any;

type Middleware = (next: AuthMiddlewareNext) => any;

const useMiddleware = function () {
  const [middlewareType, setMiddlewareType] = useState<'AUTH' | null>(null);
  const [nextAction, setNextAction] = useState<AuthMiddlewareNext | undefined>(undefined);
  const { showAuthModal, isAuthModalOpen } = useAuthModalContext();
  const currentUser = useSignedInUser();

  const removeNextAction = () => {
    setNextAction(undefined);
    setMiddlewareType(null);
  };

  useEffect(() => {
    if (middlewareType === 'AUTH' && currentUser.isSignedIn) {
      nextAction?.(currentUser.accessToken!);
      removeNextAction(); // Reset next action since it is already executed
    }
  }, [currentUser.isSignedIn, currentUser.accessToken]);

  useEffect(() => {
    // If user closes the auth modal without signing in
    if (!isAuthModalOpen && middlewareType === 'AUTH') removeNextAction();
  }, [isAuthModalOpen, middlewareType]);

  const withAuth: Middleware = function (next: AuthMiddlewareNext) {
    setMiddlewareType('AUTH');
    console.log('Is signed in: ', currentUser.isSignedIn);

    if (!currentUser.isSignedIn) {
      showAuthModal!('login');
      return setNextAction(() => next); // Cache the next function that will be run once user signs in
    }
    // Proceed if logged in
    next(currentUser.accessToken!);
  };

  // const withApiAuthErrorHandler = async (req: Promise<any>) => {

  // }

  return { withAuth };
};

export default useMiddleware;
