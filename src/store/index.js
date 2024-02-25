import { createStore } from 'vuex';

export const store = createStore({
  state: {
    jwt: '',
    id: '',
    login: '',
    password: ''
  },
  getters: {},
  mutations: {
    change_jwt(state, payload) {
      state.jwt = payload;
    },
    change_id(state, payload) {
      state.id = payload;
    },
    change_login(state, payload) {
      state.login = payload;
    },
    change_password(state, payload) {
      state.password = payload;
    }
  },
  actions: {
    update_jwt({ commit }, note) {
      commit('change_jwt', note);
    },
    update_id({ commit }, note) {
      commit('change_id', note);
    },
    update_login({ commit }, note) {
      commit('change_login', note);
    },
    update_password({ commit }, note) {
      commit('change_password', note);
    },
    save_jwt() {
      localStorage.jwt = this.jwt;
    }
  }
});
