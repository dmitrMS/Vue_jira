import axios from 'axios';

export class Api {
  constructor() {}

  async signIn(login, password, path) {
    // создание запроса на авторизацию, заполнение параметров local storage, сохранение jwt токена
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
    // обновление информации о пользователе в local storage
    localStorage.setItem('jwt', value.jwt);
    localStorage.setItem('role', value.role);
  }

  trackGuest(work) {
    // начать рабочее время для гостя в local storage
    let lastWorks = JSON.parse(localStorage.getItem('works'));
    let countWork = 0;

    lastWorks.forEach(() => {
      countWork++;
    });

    if (countWork == 0) {
      lastWorks = [];
      work.id = 1;

      lastWorks.push(work);
    } else {
      work.id = lastWorks[countWork - 1].id + 1;

      lastWorks.push(work);
    }

    localStorage.setItem('works', JSON.stringify(lastWorks));
  }

  trackStopGuest(work) {
    // закончить рабочее время гостя в local storage
    let lastWorks = JSON.parse(localStorage.getItem('works'));
    var countWork = 0;

    lastWorks.forEach(() => {
      countWork++;
    });
    lastWorks[countWork - 1] = work;

    localStorage.setItem('works', JSON.stringify(lastWorks));
  }

  trackUpdateGuest(id, task_name, begin_date, end_date) {
    // обновление рабочего времени для гостя в local storage
    let lastWorks = JSON.parse(localStorage.getItem('works'));
    const obj = lastWorks.find((item) => item.id === id);
    const index = lastWorks.indexOf(obj);

    lastWorks[index].task_name = task_name;
    lastWorks[index].begin_date = begin_date;
    lastWorks[index].end_date = end_date;

    localStorage.setItem('works', JSON.stringify(lastWorks));
  }

  trackStatusGuest() {
    // проверкка существующего рабочего времени для гостя в local storage
    let lastWorks = JSON.parse(localStorage.getItem('works'));
    var countWork = 0;

    lastWorks.forEach(() => {
      countWork++;
    });

    return countWork !== 0
      ? Object.prototype.hasOwnProperty.call(
          lastWorks[countWork - 1],
          'end_date'
        ) == false
        ? lastWorks[countWork - 1]
        : null
      : null;
  }

  trackRemoveGuest(id) {
    // удаление рабочего времени гостя в local storage
    let lastWorks = JSON.parse(localStorage.getItem('works'));
    const obj = lastWorks.find((item) => item.id === id);
    const index = lastWorks.indexOf(obj);

    if (index !== -1) {
      lastWorks.splice(index, 1);
    }

    localStorage.setItem('works', JSON.stringify(lastWorks));

    return lastWorks;
  }

  trackShowGuest() {
    // показ рабочего времени гостя
    return JSON.parse(localStorage.getItem('works'));
  }

  updateTeam(team_id, team_name) {
    localStorage.setItem('team_id', team_id);
    localStorage.setItem('team_name', team_name);
  }

  updateTeamCal(team_id_cal) {
    localStorage.setItem('team_id_cal', team_id_cal);
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('login');
  }

  async connect() {
    // проверка открытой учётной записи
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
