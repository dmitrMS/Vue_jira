import axios from 'axios';

export class Api {
  constructor() { }

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

  trackGuest(work) {
    console.log(',,,,,,');
    var lastWorks = JSON.parse(localStorage.getItem('works'));
    var c = 0;
    // lastWorks.forEach(()=>{c++;});
    // for (const element of lastWorks){c++;};
    if (lastWorks == null) {
      lastWorks = [];
      work.id = 1;

      lastWorks.push(work);
    } else {
      console.log(c - 1);
      work.id = lastWorks[c - 1].id + 1;

      lastWorks.push(work);
    }

    console.log(lastWorks);
    localStorage.setItem('works', JSON.stringify(lastWorks));
    console.log(JSON.parse(localStorage.getItem('works')));
  }

  trackUpdateGuest(work) {
    let lastWorks = JSON.parse(localStorage.getItem('works'));

    lastWorks[lastWorks.lenght - 1] = work;
    localStorage.setItem('works', JSON.stringify(lastWorks));
  }

  trackStatusGuest() {
    let lastWorks = JSON.parse(localStorage.getItem('works'));
    var obj = {};

    return lastWorks.keys(obj).length == 0
      ? Object.prototype.hasOwnProperty.call(lastWorks[lastWorks.lenght - 1], "end_date") == false
        ? lastWorks[lastWorks.lenght - 1]
        : null
      : null;
  }

  trackRemoveGuest(id) {
    let lastWorks = JSON.parse(localStorage.getItem('works'));
    let index = lastWorks.indexOf(id);

    if (index !== -1) {
      lastWorks.splice(index, 1);
    }

    localStorage.setItem('works', JSON.stringify(lastWorks));

    return lastWorks;
  }

  trackShowGuest() {
    return JSON.parse(localStorage.getItem('works'));
  }

  updateTeam(team_id) {
    localStorage.setItem('team', team_id);
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
