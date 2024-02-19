<template>
  <div class="authbodysignin">
    <div class="txt">
      <h1>Please sing in</h1>
      <div class="auth">
        <p>login:</p>
        <input type="text" v-model="login" />
        <p>password:</p>
        <input type="text" v-model="password" />
      </div>
      <br />
      <button @click="get_authentification" role="link">
        Sign In
      </button>
      <p>{{ info }}</p>
      <router-link to="/sign_up">I don't have account</router-link>
    </div>
  </div>
  <div class="fon"/>
</template>

<script>
export default {
  name: 'SignIn',
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
        process.env.VUE_APP_URL + '/auth/signin',
        {
          login: this.login,
          password: this.password,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      this.$store.dispatch('update_jwt', data.jwt);
      // console.log(data.jwt);
      // localStorage.removeItem('jwt');
      // localStorage.setItem('jwt', data.jwt);
      this.$api.sign_in(data.jwt);
      console.log(this.$api.connect('jwt'));
      this.info = data.message;
      
      if (data.jwt !== undefined) this.$router.push({ path: '/track' });
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
}

.authbodysignin h1 {
  font-weight: normal;
}

.authbodysignin .txt {
  margin: 0 0;
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
