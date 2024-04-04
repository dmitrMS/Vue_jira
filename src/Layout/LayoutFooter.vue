<template>
    <div class="hello">
    <footer class="text-muted">
      <div class="container">
          <Panel>
            <p class="m-0">
              ©Copyright 2024, Dmitry Zhukov
            </p>
          </Panel>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'myApp',

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.hello {
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 30px;
}
</style>
