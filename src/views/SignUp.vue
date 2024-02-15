<template>
  <div class="authbody">
    <div class="txt">
      <h1>Please sing up</h1>
      <div class="auth">
        <p>login:</p>
        <input class="input_auth" type="text" v-model="login" />
        <p>password:</p>
        <input class="input_auth" type="text" v-model="password" />
      </div>
      <br />
      <button class="button_auth" @click="get_authentification" role="link">
        Sign Up
      </button>
      <br />
      <router-link to="/">I already have account</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  data() {
    return {
      info: '',
      password: null,
      login: null
    };
  },
  methods: {
    async get_authentification() {
      const { data } = await this.axios.post(
        process.env.VUE_APP_URL + '/auth/signup',
        {
          login: this.login,
          password: this.password,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      this.$store.dispatch('update_jwt', data.jwt);
      this.info = data.message;
      if (data.jwt !== undefined) this.$router.push({ path: '/track' });
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
