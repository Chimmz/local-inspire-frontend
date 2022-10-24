import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

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

callbacks.signIn = async ({ user, account, credentials }) => {
  // if (account.provider === 'login') // You can check if user trying to login has existed before
  // if (account.type === 'credentials') // You can check if user is signing in with credentials
  // if (credentials) // This will be false if using Oauth
  return true;
};

// {
//   id: '103489165899128153165',
//   name: 'Chima Divine',
//   email: 'chimaorji25@gmail.com',
//   image: 'https://lh3.googleusercontent.com/a/ALm5wu2VVlVO3YiX1lBhfw8mdxfmfRoVZ1N_hmzyE0IXOw=s96-c'
// } {
//   name: 'Chima Divine',
//   email: 'chimaorji25@gmail.com',
//   picture: 'https://lh3.googleusercontent.com/a/ALm5wu2VVlVO3YiX1lBhfw8mdxfmfRoVZ1N_hmzyE0IXOw=s96-c',
//   sub: '103489165899128153165'
// } {
//   provider: 'google',
//   type: 'oauth',
//   providerAccountId: '103489165899128153165',
//   access_token: 'ya29.a0Aa4xrXNObAqEGKYvlqoPYono6GDLd8lnAgvxaSJ_CgZAisq8CsbXaOKBkH32pKTy32Iz6YGdjPNOC1qgv6ZS8DvFOtAS7ECNhDGEKgOWfAH2Br6mRloz3Hj-nP_tijDz5kl8cTii5oQ4hBOUMHzWNvH1S2c1XQaCgYKATASARMSFQEjDvL9JJa896ghCdORaGyLzcpIYw0165',
//   expires_at: 1666616849,
//   scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
//   token_type: 'Bearer',
//   id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMWI5Zjg4Y2ZlMzE1MWRkZDI4NGE2MWJmOGNlY2Y2NTliMTMwY2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDczMDEwMTE1MjAtcDU2djRvcnBxN3NzYnQyM21sdDgxdHQwdnRwZ250NzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMDczMDEwMTE1MjAtcDU2djRvcnBxN3NzYnQyM21sdDgxdHQwdnRwZ250NzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM0ODkxNjU4OTkxMjgxNTMxNjUiLCJlbWFpbCI6ImNoaW1hb3JqaTI1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiZHdEbkkyTVpRbGcwYW1xalJwY1JGQSIsIm5hbWUiOiJDaGltYSBEaXZpbmUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUxtNXd1MlZWbFZPM1lpWDFsQmhmdzhtZHhmbWZSb1ZaMU5faG16eUUwSVhPdz1zOTYtYyIsImdpdmVuX25hbWUiOiJDaGltYSIsImZhbWlseV9uYW1lIjoiRGl2aW5lIiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE2NjY2MTMyODcsImV4cCI6MTY2NjYxNjg4N30.boprXITRazu_uOS_b6-0VG7HOyzjyIBbU7kcWXo6fyE_pQ3Q1OCUodQVOkLpOqzYzSBmwYC_tH-u4pxVTgPEdj_LezQL2mJLCnycFGnzabB6qM6ANOn7wbritKZoWdkBkSzxguviV3z4cShWOnU__N-40LwHL0Typ0PHaHw2qQTduMQQnB5k-fly4brK9fcHm3x5jJ2rGHzp1EpRO4ajwt87Ht05X1kIwHlcE4w2MaLd7mralrdAQBv5-S4zNgZbuFdACJct7ISRknLsaG_gEF4eIc2bfBpjozchhtlerfe8AgZEJtXuJDp-xv2IipBkiJXwf8c3z_nYbb1DpRuDlg'
// }
callbacks.jwt = async ({ user, token, account, isNewUser }) => {
  console.log('In JWT: ', user, token, account, isNewUser);
  if (!user) return token; // If token creation is not at login/sign (when user is truthy)

  token = user;
  // if (account.provider === 'google') {
  //   const oathSigninDetails = {
  //     user: { ...user, username: user.name },
  //     params: account,
  //   };
  // }

  return token;
};

callbacks.session = async ({ session, token }) => {
  console.log('In session: ', session, token);
  if (token) session.user = token;
  return session;
};

export const authOptions = {
  providers: [loginProvider, signupProvider, googleProvider],
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
