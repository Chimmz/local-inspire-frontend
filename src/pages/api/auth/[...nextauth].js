import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

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

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const facebookProvider = FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  authorization: { params: { scope: 'email' } },
});

callbacks.signIn = async ({ user, account, credentials }) => {
  // if (account.provider === 'login') // You can check if user trying to login has existed before
  // if (account.type === 'credentials') // You can check if user is signing in with credentials
  // if (credentials) // This will be false if using Oauth
  return true;
};

callbacks.jwt = async ({ user, token, account, isNewUser }) => {
  console.log('In JWT: ', user, token, account, isNewUser);
  // If token is not being created
  if (!user) return token;

  switch (account.type) {
    case 'credentials':
      token = user;
      break;

    case 'oauth': {
      try {
        const res = await API.oauthSignIn(user, account);
        if (res.status === 'SUCCESS') token = res.data;
        console.log('API Response: ', res);
      } catch (err) {
        console.log('Error: ' + err.message);
      }
    }
  }
  return token;
};

callbacks.session = async ({ session, token }) => {
  // console.log('In session: ', session, token);
  if (token) session.user = token;
  return session;
};

export const authOptions = {
  providers: [loginProvider, signupProvider, googleProvider, facebookProvider],
  callbacks,
};
export default NextAuth(authOptions);

// const facebookProvider = async () => {

// }
// const twitterProvider = async () => {

// }

// Persisting data into a session: scroll 40% down
// https://github.com/nextauthjs/next-auth/issues/371

// Modifying session data: scroll 25% down - Response from 'toomus'
// https://github.com/nextauthjs/next-auth/discussions/4229
