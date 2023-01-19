import { RequestInit } from 'next/dist/server/web/spec-extension/request';

interface RequestConfig {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: string | FormData;
  headers?: object;
  mode?: string;
}

class API {
  async _makeRequest({ path, ...config }: RequestConfig) {
    const isApiCall = path.startsWith('/');
    const api =
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_API_BASE_URL_REMOTE
        : process.env.NEXT_PUBLIC_API_BASE_URL_RENDER;

    try {
      const fullUrl = isApiCall ? api!.concat(path) : path;
      const res = await fetch(fullUrl, { ...config } as RequestInit);
      return await res.json();
    } catch (err) {
      console.log('Error log in _makeRequest: ', err);
      return err;
    }
  }

  async isEmailAreadyInUse(email: string) {
    return this._makeRequest({
      path: `/users/is-email-in-use?email=${email}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async register(formData: FormData) {
    // const fd = new FormData();
    // fd.append('name', 'Chima');
    // fd.append('age', '22');

    return this._makeRequest({
      path: `/users/signup`,
      method: 'POST',
      // body: JSON.stringify(credentials),
      body: formData,
      // body: fd,
      // headers: { 'Content-Type': 'multipart/form-data; boundary=--photo' },
    });
  }

  async signup(formData: FormData) {
    console.log('In signup: ', formData);
    return this._makeRequest({
      path: '/users/signup',
      method: 'POST',
      body: formData,
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this._makeRequest({
      path: '/users/login',
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // async oauthSignIn(user: object, account: { provider: object }) {
  //   const { provider, ...accountInfo } = account;

  //   return this._makeRequest({
  //     path: `/users/oauth/${provider}`,
  //     method: 'POST',
  //     body: JSON.stringify({ user, account: accountInfo }),
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  // }
  async oauthSignIn(provider: string, accessToken?: string, profile?: string) {
    console.log('The profile object: ', profile);
    return this._makeRequest({
      path: `/users/oauth/${provider}?access_token=${accessToken}`,
      method: 'POST',
      body: profile,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async forgotPassword(email: string) {
    return this._makeRequest({
      path: `/users/forgot-password?email=${email}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async resetPassword(code: string, newPassword: string) {
    return this._makeRequest({
      path: `/users/reset-password?code=${code}`,
      method: 'POST',
      body: JSON.stringify({ newPassword }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async confirmMyAccount(email: string) {
    return this._makeRequest({
      path: `/users/confirm-account?email=${email}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async searchBusinessCategories(query: string) {
    return this._makeRequest({
      path: `/businesses/categories/search?textQuery=${query}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async searchCities(query: string) {
    return this._makeRequest({
      path: `/cities/search?textQuery=${query}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async findBusinesses(
    category: string,
    city: string,
    stateCode: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    return this._makeRequest({
      path: `/businesses/find?category=${category}&city=${city}&stateCode=${stateCode}&page=${page}&limit=${limit}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getBusinessById(businessId: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}`,
      method: 'GET',
    });
  }

  async reviewBusiness({
    businessId,
    token,
    formData,
  }: {
    businessId: string;
    token: string;
    formData: FormData;
  }) {
    return this._makeRequest({
      path: `/businesses/${businessId}/reviews`,
      method: 'POST',
      body: formData,
      headers: { authorization: `Bearer ${token}` },
    });
  }

  async getBusinessReviews(businessId: string, queryStr?: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}/reviews`.concat(queryStr || ''),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getUserReviewOnBusiness(businessId: string, uid: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}/user-review?uid=${uid}`,
      method: 'GET',
    });
  }

  async toggleBusinessReviewHelpful(businessId: string, token: string) {
    return this._makeRequest({
      path: `/businesses/reviews/${businessId}/like`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async askQuestionAboutBusiness(question: string, businessId: string, token: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}/ask`,
      method: 'POST',
      body: JSON.stringify({ question }),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async addAnswerToBusinessQuestion(questionId: string, answer: string, token: string) {
    return this._makeRequest({
      path: `/businesses/questions/${questionId}/answer`,
      method: 'POST',
      body: JSON.stringify({ answer }),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async toggleLikeAnswerToBusinessQuestion(
    questionId: string,
    answerId: string,
    token: string,
  ) {
    return this._makeRequest({
      path: `/businesses/questions/${questionId}/answers/${answerId}/like`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async toggleDislikeAnswerToBusinessQuestion(
    questionId: string,
    answerId: string,
    token: string,
  ) {
    return this._makeRequest({
      path: `/businesses/questions/${questionId}/answers/${answerId}/dislike`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getQuestionsAskedAboutBusiness(businessId: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}/questions`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getTipsAboutBusiness(businessId: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}/tips`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default new API();
