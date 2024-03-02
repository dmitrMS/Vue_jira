<template>
  <div class="all-body">
    <div class="rout-link">
      <p><img src="../assets/logo.png" /></p>
      <p @click="userLogout">logout</p>
    </div>
    <div class="track-body">
      <input type="text" />
      <div class="txt">
        <button>{{ workAppText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api/index.js';

export default {
  data() {
    return {
      workAppText: 'Start',
      api: api
    };
  },
  name: 'TrackPage',
  methods: {
    userLogout() {
      this.$store.dispatch('updateJwt', '');
      this.api.logout();
      this.$router.push({ path: '/' });
    }
  }
};
</script>

<style>
.all-body {
  background-color: #7ab7f0d7;
  background-position: bottom right;
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.track-body {
  margin: 0 0;
  font-style: italic;
  line-height: 5;
  display: inline-flex;
  transform: translate(5%, 200%);
}

.track-body input {
  border: 0px solid;
  border-radius: 30px;
  height: 35px;
  width: 1200px;
  opacity: 100%;
}

.track-body button {
  background-color: #16558fd7;
  color: #ffffffd7;
  border: 0px solid;
  width: 200px;
  height: 60px;
  font-size: 16pt;
  font-weight: normal;
  transform: translate(10%, 0%);
}

.rout-link {
  display: inline-flex;
  transform: translate(1800%, 0%);
  text-align: right;
  color: #000000d7;
  font-size: 16pt;
}

.rout-link img {
  width: 30px;
  height: 30px;
  transform: translate(-100%, 0%);
}
</style>
