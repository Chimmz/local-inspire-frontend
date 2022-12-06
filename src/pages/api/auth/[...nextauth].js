import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import API from '../../../features/library/api';

const callbacks = {};

callbacks.signIn = async ({ user, account, credentials }) => {
  // if (account.provider === 'login') // You can check if user trying to login has existed before
  // if (account.type === 'credentials') // You can check if user is signing in with credentials
  // if (credentials) // This will be false if using Oauth
  return true;
};

callbacks.jwt = async ({ user, token, account, isNewUser }) => {
  console.log('In JWT: ', { user, token, account, isNewUser });
  // If token is not being created
  if (!user) return token;

  switch (account.provider) {
    case 'login':
    case 'register':
    case 'google-custom':
    case 'facebook-custom':
      token = user;
      break;

    // case 'google-custom': {
    //   try {
    //     const res = await API.oauthSignIn(user, account);
    //     if (res.status === 'SUCCESS') token = res.data;
    //     console.log('API OAuth Response: ', res);
    //   } catch (err) {
    //     console.log('API OAuth Error: ' + err.message);
    //   }
    // }
  }
  return token;
};

callbacks.session = async ({ session, token }) => {
  // console.log('In session: ', session, token);
  if (token) session.user = token;
  return session;
};

const loginProvider = CredentialsProvider({
  id: 'login',
  authorize: async (credentials, req) => {
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
  },
});

const signupProvider = CredentialsProvider({
  id: 'register',
  authorize: async function (credentials, req) {
    const res = await API.register(credentials);
    console.log('Sign up response: ', res);

    switch (res.status) {
      case 'SUCCESS':
        const tokenPayload = res.data;
        return tokenPayload;

      case 'FAIL':
        throw new Error(JSON.stringify(res));
      case 'ERROR':
        throw new Error(JSON.stringify(res));
      default:
        throw new Error('Something wrong happened');
    }
  },
});

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const customGoogleProvider = CredentialsProvider({
  id: 'google-custom',
  authorize: async (credentials, req) => {
    const res = await API.oauthSignIn('google', credentials.access_token);
    console.log('Google Response: ', res);

    switch (res.status) {
      case 'SUCCESS':
        const tokenPayload = res.data;
        return tokenPayload;

      case 'FAIL':
      case 'ERROR':
        throw new Error(res.reason);
    }
  },
});

const customFacebookProvider = CredentialsProvider({
  id: 'facebook-custom',
  authorize: async (credentials, req) => {
    const { access_token, profile } = credentials;

    const res = await API.oauthSignIn('facebook', access_token, profile);
    console.log('Facebook Response: ', res);

    switch (res.status) {
      case 'SUCCESS':
        const tokenPayload = res.data;
        return tokenPayload;

      case 'FAIL':
      case 'ERROR':
        throw new Error(res.reason);
    }
  },
});

const facebookProvider = FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  authorization: { params: { scope: 'email' } },
});

export const authOptions = {
  providers: [
    loginProvider,
    signupProvider,
    customGoogleProvider,
    // googleProvider,
    // facebookProvider,
    customFacebookProvider,
  ],
  callbacks,
};

export default NextAuth(authOptions);

// Persisting data into a session: scroll 40% down
// https://github.com/nextauthjs/next-auth/issues/371

// Modifying session data: scroll 25% down - Response from 'toomus'
// https://github.com/nextauthjs/next-auth/discussions/4229
