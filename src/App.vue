<template>
  <router-view />
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
  margin: 0px;
}
</style>
