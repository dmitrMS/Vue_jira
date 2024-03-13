import { createStore } from 'vuex';
import { api } from '../api/index.js';

export const store = createStore({
  state: {
    jwt: '',
    id: '',
    login: '',
    password: ''
  },
  getters: {},
  mutations: {
    changeJwt(state, payload) {
      state.jwt = payload;
    },
    changeId(state, payload) {
      state.id = payload;
    },
    changeLogin(state, payload) {
      state.login = payload;
    },
    changePassword(state, payload) {
      state.password = payload;
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

      commit('changeJwt', jwt);

      return jwt;
    },
    logoutJwt({ commit }) {
      this.api.logout();

      commit('changeJwt', '');
    },
    updateId({ commit }, note) {
      commit('changeId', note);
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
