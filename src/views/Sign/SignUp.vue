<template>
  <div class="authbodysign">
    <div class="authbodysign__text">
      <h1>Регистрация</h1>
      <div class="authbodysignin__text-block">
        <p>логин:</p>
          <input id="username" v-model="login" />
        <p>пароль:</p>
          <input type="password" v-model="password" inputId="password" @keyup.enter="getAuthentification"/>
      </div>
      <button @click="getAuthentification" role="link">
        Создать
      </button>
      <br />
      <router-link to="/">У меня уже есть аккаунт</router-link>
    </div>
  </div>
</template>

<script>
import './Sign.css';

export default {
  name: 'SignUp',
  data() {
    return {
      password: '',
      login: '',
      value: null
    };
  },
  methods: {
    async getAuthentification() {
      // создание учётной записи пользователя
      const regex =
        /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g;
      const symbol = this.password.match(regex);
      console.log(symbol);
      if (symbol !== null) {
        const config = {
          login: this.login,
          password: this.password,
          path: '/auth/signup'
        };
        const request = await this.$store.dispatch('getJwt', config);

        if (request !== undefined) this.$router.push({ path: '/projects' });
      }
    }
  }
};
</script>