import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import API from '../../../features/utils/api-utils';

// NOTE: When deploying to production, set the:
// NEXTAUTH_URL environment variable to the canonical URL of your site". NEXTAUTH_URL=https://example.com
// NEXTAUTH_SECRET

const callbacks = {};

const loginProvider = CredentialsProvider({
  id: 'login',
  authorize: async (credentials, req) => {
    try {
      const res = await API.login(credentials);
      console.log('Response login: ', res);

      switch (res.status) {
        case 'SUCCESS':
          const tokenPayload = res.data;
          return tokenPayload;

        case 'FAIL':
        case 'ERROR':
          throw new Error(res.reason);
      }
    } catch (err) {
      console.log('Error: ', err);
      throw new Error('An error occurred');
    }
  },
});

const signupProvider = CredentialsProvider({
  id: 'register',
  authorize: async function (credentials, req) {
    try {
      const res = await API.register(credentials);
      console.log(res);

      switch (res.status) {
        case 'SUCCESS':
          const tokenPayload = res.data;
          return tokenPayload;

        case 'FAIL':
        case 'ERROR':
          throw new Error(res.reason);
      }
    } catch (err) {
      console.log('Error: ', err);
    }
  },
});

callbacks.signIn = async ({ user, account, credentials }) => {
  // if (account.provider === 'login') // You can check if user trying to login has existed before
  // if (account.type === 'credentials') // You can check if user is signing in with credentials
  // if (credentials) // This will be false if using Oauth
  return true;
};

callbacks.jwt = async ({ user, token, account, isNewUser }) => {
  if (user) {
    console.log('In JWT: ', token, user);
    token = user;
  }
  return token;
};

callbacks.session = async ({ session, token }) => {
  if (token) session.user = token;
  return session;
};

export const authOptions = {
  providers: [loginProvider, signupProvider],
  callbacks,
};

export default NextAuth(authOptions);

// const googleProvider = async () => {

// }
// const facebookProvider = async () => {

// }
// const twitterProvider = async () => {

// }

// Persisting data into a session: scroll 40% down
// https://github.com/nextauthjs/next-auth/issues/371

// Modifying session data: scroll 25% down - Response from 'toomus'
// https://github.com/nextauthjs/next-auth/discussions/4229
