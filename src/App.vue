<template>
  <router-view />
</template>

<script>
import { Api } from './api/index.js';

export default {
  data() {
    return {
      api: new Api()
    };
  },
  methods: {
    async get_authentification() {
      try{
      const connect_res_data = {};
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': await this.api.connect('jwt')
        }
      };
      const { data } = await this.axios.post(
        process.env.VUE_APP_URL + '/auth/connect',
        connect_res_data,
        config
      );

      this.$store.dispatch('update_jwt', data.jwt);
      this.api.sign_in(data.jwt);
      this.info = data.message;
      this.$router.push({ path: '/track' });

      return true;
    }
    catch
    {
      return null;
    }
    }
  },
  created () {
    this.get_authentification();
  }
};
</script>

<style>
body {
  margin: 0px;
}
</style>
