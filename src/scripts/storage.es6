
const ACCESS_TOKEN_KEY = 'github.accessToken';

export default class Storage {
  static get accessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static setAccessToken(token) {
    return localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

