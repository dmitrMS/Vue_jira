<template>
  <div class="authbody">
    <h1>Please sing up</h1>
    <div class="auth">
      <p>login:</p>
      <input class="input_auth" type="text" />
      <p>password:</p>
      <input class="input_auth" type="text" />
    </div>
    <br />
    <div class="txt">
      <router-link to="/track" custom v-slot="{ navigate }">
        <button class="button_auth" @click="navigate" role="link">
          Sign Up
        </button> </router-link
      ><br />
      <router-link to="/">I don't have account</router-link>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUp'
};
</script>

<style>
html {
  background-color: #7ab7f0d7;
}
.authbody {
  margin: 0 0;
  text-align: center;
  font-style: italic;
  line-height: 5;
  transform: translate(0%, 25%);
}
.auth input {
  background-color: #7ab7f000;
  border: 0px solid;
  border-bottom: 2px solid #000000;
  width: 200px;
  opacity: 100%;
}
a {
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
h1 {
  font-weight: normal;
}
.txt {
  line-height: 2;
}
.auth {
  font-size: 16pt;
  line-height: 0;
}
</style>
