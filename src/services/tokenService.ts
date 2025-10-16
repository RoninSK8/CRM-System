import type { AccessToken } from '../types/types';

class TokenService {
  #token: AccessToken | null = null;

  setAccessToken(newToken: AccessToken) {
    this.#token = newToken;
  }

  getAccessToken() {
    return this.#token;
  }

  clearAccessToken() {
    this.#token = null;
  }
}

export const tokenService = new TokenService();
