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

  async updateUserLocation(locationObj: object, token: string) {
    return this._makeRequest({
      path: `/users/update-user-location`,
      method: 'PATCH',
      body: JSON.stringify(locationObj),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
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
      path: `/reviews/on/${businessId}/new`,
      method: 'POST',
      body: formData,
      headers: { authorization: `Bearer ${token}` },
    });
  }

  async addPhotosOfBusiness(args: { businessId: string; token: string; formData: FormData }) {
    return this._makeRequest({
      path: `/reviews/by-user/on/${args.businessId}/add-photos`,
      method: 'PATCH',
      body: args.formData,
      headers: { authorization: `Bearer ${args.token}` },
    });
  }

  async getBusinessReviews(
    businessId: string,
    queryStr?: string,
    options?: { page: number; limit: number },
  ) {
    return this._makeRequest({
      path: `/reviews/businesses/${businessId}`
        .concat(queryStr || '')
        .concat(!queryStr?.length && options ? '?' : '')
        .concat(options ? `&page=${options.page}&limit=${options.limit}` : ''),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getUserReviewOnBusiness(businessId: string, token: string) {
    return this._makeRequest({
      path: `/reviews/on/${businessId}/by-user`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getReviewsMadeByUser(token: string) {
    return this._makeRequest({
      path: `/reviews/made-by-user`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getReviewById(id: string) {
    return this._makeRequest({
      path: `/reviews/${id}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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
      path: `/questions/about/${businessId}`,
      method: 'POST',
      body: JSON.stringify({ question }),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async addAnswerToBusinessQuestion(questionId: string, answer: string, token: string) {
    return this._makeRequest({
      path: `/questions/${questionId}/answers`,
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
      path: `/questions/${questionId}/answers/${answerId}/like`,
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
      path: `/questions/${questionId}/answers/${answerId}/dislike`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getQuestionsAskedAboutBusiness(
    businessId: string,
    queryStr?: string,
    opts?: { page?: number; limit?: number },
  ) {
    const url = `/questions/about/${businessId}`
      .concat(queryStr || '')
      .concat(!queryStr ? '?&' : '')
      .concat(opts?.page ? `&page=${opts.page}` : '')
      .concat(opts?.limit ? `&limit=${opts.limit}` : '');

    return this._makeRequest({
      path: url,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getQuestion(qId: string) {
    return this._makeRequest({
      path: `/questions/${qId}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getAnswersToQuestion(qId: string, opts?: { page: number; limit: number }) {
    return this._makeRequest({
      path: `/questions/${qId}/answers`.concat(
        opts ? `?page=${opts.page}&limit=${opts.limit}` : '',
      ),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getMostHelpfuAnswerToQuestion(qId: string) {
    return this._makeRequest({
      path: `/questions/${qId}/answers/most-helpful`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getTipsAboutBusiness(businessId: string, opts?: { page: number; limit: number }) {
    return this._makeRequest({
      path: `/businesses/${businessId}/tips`.concat(
        opts ? `?page=${opts.page}&limit=${opts.limit}` : '',
      ),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async report(body: object, token: string) {
    return this._makeRequest({
      path: '/report',
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }
}

export default new API();
