import { createStore } from 'vuex';
import { api } from '../api/index.js';

export const store = createStore({
  state: {
    jwt: '',
    login: '',
    password: '',
    team_id: null,
    works: []
  },
  getters: {},
  mutations: {
    changeJwt(state, payload) {
      state.jwt = payload;
    },
    changeTeamId(state, payload) {
      state.team_id = payload;
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
    updateTeamId({ commit }, note) {
      api.updateTeam();

      commit('changeTeamId', note);
    },
    createWorks({ commit }, note) {
      const work = api.trackStatusGuest();

      if (work==null) {
        api.trackGuest(note);

        commit('changeWorks', note);
      }
    },
    updateWorks(note) {
      const work = api.trackStatusGuest();

      if (work) {
        api.trackUpdateGuest(note);

      }
    },
    statusWorks() {
      return api.trackStatusGuest();
    },
    showWorks() {
      return api.trackShowGuest();
    },
    deleteWorks({ commit }, note) {
      console.log(note);
      const data=api.trackRemoveGuest(note);

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
