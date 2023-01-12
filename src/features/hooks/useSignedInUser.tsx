import { useSession } from 'next-auth/react';

type Params = { onSignOut?: () => any } | void;

const useSignedInUser = function (arg: Params) {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated: arg?.onSignOut,
  });

  return {
    ...session?.user,
    isSignedIn: status === 'authenticated',
  };
};

export default useSignedInUser;
