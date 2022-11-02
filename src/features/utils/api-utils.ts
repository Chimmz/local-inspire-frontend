interface RequestConfig {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: string;
  headers?: object;
  mode?: string;
  fromAPI?: boolean;
}

class API {
  async _makeRequest({ path, fromAPI = true, ...config }: RequestConfig) {
    try {
      const fullUrl = fromAPI ? process.env.NEXT_PUBLIC_API_BASE_URL_VERCEL + path : path;
      // const fullUrl = fromAPI ? process.env.NEXT_PUBLIC_API_BASE_URL_REMOTE + path : path;
      // @ts-ignore
      const resp = await fetch(fullUrl, config);
      const data = await resp.json();
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async register(credentials: { username: string; email: string; password: string }) {
    console.log('credentials: ', credentials);
    return this._makeRequest({
      path: '/users/signup',
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this._makeRequest({
      path: '/users/login',
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async oauthSignIn(user: object, account: { provider: object }) {
    const { provider, ...accountInfo } = account;

    return this._makeRequest({
      path: `/users/oauth/${provider}`,
      method: 'POST',
      body: JSON.stringify({ user, account: accountInfo }),
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

  async findBusinesses(category: string, city: string, stateCode: string): Promise<any> {
    return this._makeRequest({
      path: `/businesses/find?category=${category}&city=${city}&stateCode=${stateCode}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default new API();
