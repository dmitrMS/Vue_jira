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

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-key': data.jwt
      }
    };

    const dataUser = await axios.post(
      process.env.VUE_APP_URL + '/auth/data',
      {},
      config
    );

    localStorage.setItem('jwt', data.jwt);
    localStorage.setItem('role', dataUser.data.role);
    localStorage.setItem('login', login);

    return data;
  }

  update(value) {
    localStorage.setItem('jwt', value.jwt);
    localStorage.setItem('role', value.role);
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('login');
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

      const config1 = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': data.jwt
        }
      };

      const dataUser = await axios.post(
        process.env.VUE_APP_URL + '/auth/data',
        {},
        config1
      );

      localStorage.setItem('jwt', data.jwt);
      localStorage.setItem('role', dataUser.data.role);

      return localStorage.getItem('jwt');
    } catch {
      throw new Error('User is not authorized!');
    }
  }
}

export const api = new Api();
