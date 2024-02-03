<template>
  <div class="rout_link">
    <p><img src="../assets/logo.png" /></p>
    <p><router-link to="/">logout</router-link></p>
    <br />
  </div>
  <div class="track_body">
    <input type="text" />
    <div class="txt">
      <button>{{ work }}</button>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      work: 'Start'
    };
  },
  name: 'TrackPage'
};
</script>

<style>
html {
  background-color: #7ab7f0d7;
}
.track_body {
  margin: 0 0;
  font-style: italic;
  line-height: 5;
  display: inline-flex;
  transform: translate(5%, 200%);
}
.track_body input {
  border: 0px solid;
  border-radius: 30px;
  height: 35px;
  width: 1200px;
  opacity: 100%;
}
.track_body button {
  background-color: #16558fd7;
  color: #ffffffd7;
  border: 0px solid;
  width: 200px;
  height: 60px;
  font-size: 16pt;
  font-weight: normal;
  transform: translate(10%, 0%);
}
.rout_link {
  display: inline-flex;
  transform: translate(1800%, 0%);
  text-align: right;
  color: #000000d7;
  font-size: 16pt;
}
.rout_link img {
  width: 30px;
  height: 30px;
  transform: translate(-100%, 0%);
}
</style>
