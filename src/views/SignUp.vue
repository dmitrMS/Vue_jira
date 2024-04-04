<template>
  <div id="components-demo">
    <no-auth-layout> </no-auth-layout>
  </div>
  <div class="authbody">
    <div class="txt">
      <h1>Регистрация</h1>
      <div class="auth">
        <p>логин:</p>
        <FloatLabel>
          <InputText id="username" v-model="login" />
        </FloatLabel>
        <p>пароль:</p>
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
      <button class="button_auth" @click="getAuthentification" role="link">
        Создать
      </button>
      <br />
      <router-link to="/">У меня уже есть аккаунт</router-link>
    </div>
  </div>
</template>

<script>
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

        if (request !== undefined) this.$router.push({ path: '/track' });
      }
    }
  }
};
</script>

<style>
.authbody {
  background-color: #7ab7f0d7;
  background-position: bottom right;
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.authbody .auth input {
  background-color: #7ab7f000;
  border: 0px solid;
  border-bottom: 2px solid #000000;
  width: 200px;
  opacity: 100%;
}

.authbody .auth input:focus {
  outline: none;
}

.authbody a {
  color: #000000d7;
  font-size: 16pt;
}

.authbody button {
  background-color: #2e78bdd7;
  color: #ffffffd7;
  border: 0px solid;
  width: 200px;
  height: 60px;
  font-size: 16pt;
  font-weight: normal;
  border-radius: 30px;
  margin: 2%;
}

.authbody h1 {
  font-weight: normal;
}

.authbody .txt {
  margin: 0 0;
  text-align: center;
  font-style: italic;
  line-height: 5;
  transform: translate(0%, 25%);
}

.authbody .auth {
  font-size: 16pt;
  line-height: 0;
}
</style>
