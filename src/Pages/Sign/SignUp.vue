<template>
  <div class="authbodysign">
    <div class="authbodysign__text">
      <h1>Регистрация</h1>
      <div class="authbodysignin__text-block">
        <p>логин:</p>
          <input id="username" v-model="login" />
        <p>пароль:</p>
          <!-- <input type="password" v-model="password" inputId="password" @keyup.enter="getAuthentification"/> -->
          <FloatLabel>
          <Password v-model="password" inputId="password">
            <template #header>
              <h6>Введите пароль</h6>
            </template>
            <template #footer>
              <Divider />
              <p class="mt-2">Пароль должен содержать:</p>
              <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                <li>Хотя бы одну букву в нижнем регистре</li>
                <li>Хотя бы одну букву в верхнем регистре</li>
                <li>Хотя бы одну цифру</li>
                <li>1 спец символ</li>
                <li>Минимум 8 символов</li>
              </ul>
            </template>
          </Password>
        </FloatLabel>
      </div>
      <button @click="getAuthentification" role="link">
        Создать
      </button>
      <br />
      <p>{{ this.serverMessage }}</p>
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
      serverMessage: '',
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
      // console.log(symbol);
      if (symbol !== null) {
        const config = {
          login: this.login,
          password: this.password,
          path: '/auth/signup'
        };
        const request = await this.$store.dispatch('getJwt', config);

        if (request !== undefined) this.$router.push({ path: '/projects' });
      }
      else {
          this.serverMessage='Пароль составлен неверно'
      }
    }
  }
};
</script>