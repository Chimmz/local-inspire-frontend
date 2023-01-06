import { IncomingMessage, ServerResponse } from 'http';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { authOptions } from './src/pages/api/auth/[...nextauth]';

interface ApiResponse {
  msg: string;
}

type Req = IncomingMessage & {
  cookies: Partial<{
    [key: string]: string;
  }>;
};

export const handleUnauthenticated = async (
  apiData: ApiResponse,
  req: Req,
  res: ServerResponse<IncomingMessage>,
) => {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions as NextAuthOptions,
  );

  if (!session || apiData.msg === 'AUTH_ERROR')
    return {
      props: { errorMsg: apiData.msg },
      result: { isAuthd: false },
    };
  return {
    result: { isAuthd: false },
  };
};
