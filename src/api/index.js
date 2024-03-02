import axios from 'axios';

class Api {
  constructor() {}

  async signIn(login, password, path) {
    const { data } = await axios.post(process.env.VUE_APP_URL + path, {
      login: login,
      password: password,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    localStorage.setItem('jwt', data.jwt);

    return data;
  }

  update(value) {
    localStorage.setItem('jwt', value);
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  async connect() {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      const { data } = await axios.post(
        process.env.VUE_APP_URL + '/auth/connect',
        {},
        config
      );

      this.update(data.jwt);

      return localStorage.getItem('jwt');
    } catch {
      throw new Error('User is not authorized!');
    }
  }
}

export const api = new Api();
