<template>
  <!-- <div id="components-demo">
    <no-auth-layout />
  </div> -->
  <!-- <button role="button" @click="getAuthentification">Войти</button> -->
  <Menubar />
  <div class="authbodysign">
    <div class="authbodysign__text">
      <h1>Авторизация</h1>
      <div class="authbodysignin__text-block">
        <p>логин:</p>
        <input id="username" v-model="login" />
        <p>пароль:</p>
        <input type="password" v-model="password" :feedback="false" @keyup.enter="getAuthentification"/>
      </div>
      <button role="button" @click="getAuthentification">Войти</button>
      <p>{{ serverMessage }}</p>
      <router-link to="/sign_up">У меня нет аккаунта</router-link>
    </div>
  </div>
</template>

<script>
import './Sign.css';

export default {
  name: 'SignIn',
  data() {
    return {
      serverMessage: '',
      password: '',
      login: ''
    };
  },
  methods: {
    async getAuthentification() {
      // вход в учётную запись, получение jwt токена
      const config = {
        login: this.login,
        password: this.password,
        path: '/auth/signin'
      };
      const request = await this.$store.dispatch('getJwt', config);

      this.serverMessage = request.message;

      if (request.jwt !== undefined) this.$router.push({ path: '/projects' });
    }
  }
};
</script>
