<template>
  <div id="components-demo">
    <no-auth-layout> </no-auth-layout>
  </div>
  <div class="authbodysignin">
    <div class="txt">
      <h1>Please sing in</h1>
      <div class="auth">
        <p>login:</p>
        <input type="text" v-model="login" />
        <p>password:</p>
        <input type="text" v-model="password" />
      </div>
      <button @click="getAuthentification" role="link">Sign In</button>
      <p>{{ serverMessage }}</p>
      <router-link to="/sign_up">I don't have account</router-link>
    </div>
  </div>
  <div class="fon"></div>
</template>

<script>
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
      const config = {
        login: this.login,
        password: this.password,
        path: '/auth/signin'
      };
      const request = await this.$store.dispatch('getJwt', config);

      this.serverMessage = request.message;

      if (request.jwt !== undefined) this.$router.push({ path: '/track' });
    }
  }
};
</script>

<style>
.authbodysignin {
  background-color: #7ab7f0d7;
  background-position: bottom right;
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.authbodysignin .auth input {
  background-color: #7ab7f000;
  border: 0px solid;
  border-bottom: 2px solid #000000;
  width: 200px;
  opacity: 100%;
}

.authbodysignin a {
  color: #000000d7;
  font-size: 16pt;
}

.authbodysignin button {
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

.authbodysignin h1 {
  font-weight: normal;
}

.authbodysignin .txt {
  text-align: center;
  font-style: italic;
  line-height: 5;
  transform: translate(0%, 25%);
}

.authbodysignin .auth {
  font-size: 16pt;
  line-height: 0;
}

.authbodysignin .fon {
  background-color: #7ab7f0d7;
  background-position: bottom right;
  position: absolute;
  width: 100vw;
  height: 100vh;
}
</style>
