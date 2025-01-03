import { RequestInit } from 'next/dist/server/web/spec-extension/request';

interface RequestConfig {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: string | FormData;
  headers?: object;
  mode?: string;
}

class API {
  _baseUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_API_BASE_URL_REMOTE
      : process.env.NEXT_PUBLIC_API_BASE_URL_RENDER;

  async _makeRequest({ path, ...config }: RequestConfig) {
    const isApiCall = path.startsWith('/');
    try {
      const reqUrl = isApiCall ? this._baseUrl!.concat(path) : path;
      const res = await fetch(reqUrl, { ...config } as RequestInit);
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
    return this._makeRequest({
      path: `/users/signup`,
      method: 'POST',
      body: formData,
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

  async getBusinessCategories(type: 'SIC2' | 'SIC4' | 'SIC8', queryString: string) {
    return this._makeRequest({
      path: `/businesses/categories/${type}/?${queryString}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async searchCities(textQuery: string, populate = false) {
    if (!textQuery.length) return;
    return this._makeRequest({
      path: `/cities/search?textQuery=${textQuery}`.concat(populate ? '&populate=true' : ''),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async findBusinesses(
    category: string,
    place: { city: string; stateCode: string },
    opts: { page: number; limit: number },
  ): Promise<any> {
    return this._makeRequest({
      path: `/businesses/find?category=${category}&city=${place.city}&stateCode=${place.stateCode}&page=${opts.page}&limit=${opts.limit}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async filterBusinesses(
    tags: string[],
    place: { city: string; stateCode: string },
    opts: { page: number; limit: number },
  ): Promise<any> {
    const tagsStr = tags.join(',');

    return this._makeRequest({
      path: `/businesses/filter?tags=${tagsStr}&city=${place.city}&stateCode=${place.stateCode}&page=${opts.page}&limit=${opts.limit}`,
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

  async getBusinessOverallRating(businessId: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}/overall-rating`,
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

  async getWhatPeopleSayAboutBusinesses(businessIds: string[]) {
    return this._makeRequest({
      path: `/reviews/businesses/what-people-say`,
      method: 'POST',
      body: JSON.stringify({ businesses: businessIds }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getReviewsMadeByUser(
    userId: string,
    opts?: { page: number; limit: number; populate?: boolean },
  ) {
    return this._makeRequest({
      path: `/reviews/made-by/${userId}?`
        .concat(opts?.page ? `page=${opts.page}` : '')
        .concat(opts?.limit ? `&limit=${opts.limit}` : '')
        .concat(opts?.populate ? `&populate=${opts.populate}` : ''),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getReviewById(id: string) {
    return this._makeRequest({
      path: `/reviews/${id}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getReviewLikes(id: string) {
    return this._makeRequest({
      path: `/reviews/${id}/likes`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async toggleBusinessReviewHelpful(businessId: string, token: string) {
    return this._makeRequest({
      path: `/reviews/${businessId}/like`,
      method: 'PATCH',
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

  async toggleLikeAnswerToBusinessQuestion(questionId: string, answerId: string, token: string) {
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

  async report(
    body: { reportedId: string; reason: string; explanation?: string },
    token: string,
  ) {
    return this._makeRequest({
      path: '/report',
      method: 'POST',
      body: JSON.stringify({ ...body, reported: body.reportedId }),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getUserCollections(token: string) {
    return this._makeRequest({
      path: '/users/collections',
      method: 'GET',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async addItemToCollection(collectionId: string, item: object, token: string) {
    return this._makeRequest({
      path: `/users/collections/${collectionId}/add`,
      method: 'PATCH',
      body: JSON.stringify(item),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async createCollection(body: object, token: string) {
    return this._makeRequest({
      path: '/users/collections',
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async followUser(userId: string, token: string) {
    return this._makeRequest({
      path: `/users/${userId}/follow`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getUserFollowers(userId: string) {
    return this._makeRequest({
      path: `/users/${userId}/followers`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getUserPublicProfile(userId: string) {
    return this._makeRequest({
      path: `/users/${userId}/profile`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async sendMessage(msgText: string, recipientId: string, token: string) {
    return this._makeRequest({
      path: `/messages/to/${recipientId}`,
      method: 'POST',
      body: JSON.stringify({ text: msgText }),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getUnreadMsgs(token: string) {
    return this._makeRequest({
      path: '/messages/unread',
      method: 'GET',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async updateUserProfileViews(userId: string) {
    return this._makeRequest({
      path: `/users/${userId}/profile/views`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getPeopleBlockedByUser(userId: string) {
    return this._makeRequest({
      path: `/users/blocked-by/${userId}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async toggleBlockUser(userId: string, token: string) {
    return this._makeRequest({
      path: `/users/${userId}/block`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  //////// ADMIN //////////

  async addFilter(body: object, token: string) {
    return this._makeRequest({
      path: `/admin/filters`,
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getFilters(keyword?: string) {
    return this._makeRequest({
      path: `/admin/filters${keyword ? `?keyword=${keyword}` : ''}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async editFilter(fId: string, updateObj: object, token: string) {
    return this._makeRequest({
      path: `/admin/filters/${fId}`,
      method: 'PATCH',
      body: JSON.stringify(updateObj),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async deleteFilter(filterId: string, token: string) {
    return this._makeRequest({
      path: `/admin/filters/${filterId}`,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getKeywords() {
    return this._makeRequest({
      path: `/admin/keywords`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }
  async addKeyword(body: object, token: string) {
    return this._makeRequest({
      path: `/admin/keywords`,
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }
  async editKeyword(kwId: string, updateObj: object, token: string) {
    return this._makeRequest({
      path: `/admin/keywords/${kwId}`,
      method: 'PATCH',
      body: JSON.stringify(updateObj),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }
  async deleteKeyword(kwId: string, token: string) {
    return this._makeRequest({
      path: `/admin/keywords/${kwId}`,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async claimBusiness(businessId: string, body: object, token: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}/claim`,
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getBusinessClaim(businessId: string, token: string) {
    return this._makeRequest({
      path: `/businesses/${businessId}/claim`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getBusinessUpgradePlans() {
    return this._makeRequest({
      path: `/businesses/upgrade-plans`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getBusinessClaimCheckoutSession(
    priceId: string,
    businessId: string,
    token: string,
    { returnUrl, cancelUrl }: { returnUrl: string; cancelUrl?: string },
  ) {
    return this._makeRequest({
      path: `/businesses/${businessId}/claim/checkout-session?priceId=${priceId}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  /////// CITY API ////////////
  async getCities(args?: {
    page?: number;
    limit?: number;
    isFeatured?: boolean;
    stateCode?: string;
  }) {
    const qString =
      args &&
      `?page=${args.page}&limit=${args.limit}`
        .concat(args.isFeatured ? `&isFeatured=${args.isFeatured + ''}` : '')
        .concat(args.stateCode ? `&stateCode=${args.stateCode}` : '');

    return this._makeRequest({
      path: '/cities'.concat(qString + ''),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async toggleCityFeatured(cityId: string, token: string) {
    return this._makeRequest({
      path: `/cities/${cityId}/toggle-featured`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    });
  }

  async getUsaStates() {
    return this._makeRequest({
      path: `/cities/all-states`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async updateCity(cityId: string, body: FormData, token: string) {
    return this._makeRequest({
      path: `/cities/${cityId}`,
      method: 'PATCH',
      body,
      headers: { authorization: `Bearer ${token}` },
    });
  }
}

export default new API();
