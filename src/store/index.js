import { createStore } from 'vuex';
import { api } from '../api/index.js';

// создание session storage

export const store = createStore({
  state: {
    jwt: '',
    login: '',
    password: '',
    role_id: null,
    task_id: null,
    task_name: null,
    team_id_cal: null,
    works: []
  },
  getters: {},
  mutations: {
    // изменение параметров в session storage
    changeJwt(state, payload) {
      state.jwt = payload;
    },
    changeTeamId(state, payload) {
      state.task_id = payload;
    },
    changeRoleId(state, payload) {
      state.role_id = payload;
    },
    changeTeamName(state, payload) {
      state.task_name = payload;
    },
    changeTeamIdCal(state, payload) {
      state.team_id_cal = payload;
    },
    changeLogin(state, payload) {
      state.login = payload;
    },
    changePassword(state, payload) {
      state.password = payload;
    },
    changeWorks(state, payload) {
      state.works.push(payload);
    }
  },
  actions: {
    // комбинированные действия с  параметрами в session storage
    updateJwt({ commit }, note) {
      commit('changeJwt', note);
    },
    async getJwt({ commit }, config) {
      const jwt = api.signIn(config.login, config.password, config.path);

      commit('changeJwt', jwt);

      return jwt;
    },
    verifyJwt({ commit }) {
      const jwt = api.connect();

      commit('changeJwt', jwt.id);

      return jwt;
    },
    logoutJwt({ commit }) {
      api.logout();

      commit('changeJwt', '');
    },
    updateTaskId({ commit }, note) {
      // console.log(note.task_id);
      // api.updateTeam(note.task_id,note.task_name);

      commit('changeTeamId', note.id);
      commit('changeTeamName', note.name);
    },
    updateRoleId({ commit }, note) {
      commit('changeRoleId', note);
    },
    updateTeamIdCal({ commit }, note) {
      api.updateTeamCal(note);

      commit('changeTeamIdCal', note);
    },
    createWorks({ commit }, note) {
      const work = api.trackStatusGuest();

      if (work == null) {
        api.trackGuest(note);

        commit('changeWorks', note);
      }
    },
    stopWorks({ commit }, note) {
      const work = api.trackStatusGuest();

      if (work) {
        api.trackStopGuest(note);

        commit('changeWorks', note);
      }
    },
    updateWorks({ commit }, note) {
      const data = api.trackUpdateGuest(
        note.id_work,
        note.task_name,
        note.begin_date,
        note.end_date
      );

      commit('changeWorks', data);
    },
    statusWorks() {
      return api.trackStatusGuest();
    },
    showWorks() {
      return api.trackShowGuest();
    },
    deleteWorks({ commit }, note) {
      const data = api.trackRemoveGuest(note);

      commit('changeWorks', data);
    },
    updateLogin({ commit }, note) {
      commit('changeLogin', note);
    },
    updatePassword({ commit }, note) {
      commit('changePassword', note);
    },
    save_jwt() {
      localStorage.jwt = this.jwt;
    }
  }
});
