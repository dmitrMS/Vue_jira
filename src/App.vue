<template>
  <router-view />
</template>

<script>
export default {
methods:{
  async get_authentification() {
      const { data } = await this.axios.post(
        process.env.VUE_APP_URL + '/auth/connect',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-key' : this.$api.connect()
          }
        }
      );
      
      this.$store.dispatch('update_jwt', data.jwt);
      this.$api.sign_in(data.jwt);
      console.log(localStorage.getItem('jwt'));
      this.info = data.message;

      return data.jwt !== undefined ? this.$router.push({ path: '/' }) : this.$router.push({ path: '/track' }) ;
    }
},
created() {
    this.get_authentification();
  }
}
;
</script>

<style>
body {
 margin: 0px;
}
</style>
