import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      emailVerified: boolean;
      imgUrl: string;
      signedUpWith: 'google' | 'facebook' | 'credentials' | 'twitter';
      role: 'USER' | 'CITY_MANAGER' | 'BUSINESS_OWNER' | 'MAIN_ADMIN';
      currentlyLoggedInWith: 'google' | 'facebook' | 'credentials' | 'twitter';
      accessToken: string;
      rft: string;
    };
  }
}
