<template>
  <div id="components-demo">
  <router-view />
  
    <footer-layout class="footer-bottom"/>
  </div>
</template>

<script>
import { api } from './api/index.js';

export default {
  data() {
    return {
      api: api,
      computed: {
            layout(){
                return this.$route.meta.layout 
            }
        }
    };
  },
  methods: {
    async getAuthentification() {
      try { 
      await this.$store.dispatch('verifyJwt');
      // if(jwt.role=='employer') {
      //   this.$router.push({ path: '/track' });
      // }

      this.$router.push({ path: '/track' });

    } catch (err) {
        console.log(err);

        this.$router.push({ path: '/' });
    }
    }
  },
  created () {
    this.getAuthentification();
  }
};
</script>

<style>
body {
  margin: 0;
  overflow-x: hidden;
}
</style>
