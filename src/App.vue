<template>
  <div id="components-demo">
    <router-view />
    <template>
      <VErrorBoundary :fall-back="fallBack" stop-propagation> </VErrorBoundary>
    </template>
  </div>
</template>

<script>
import { api } from './api/index.js';
import MyCustomFallbackComponent from './Pages/ErrorBoundary.vue';

export default {
  data() {
    return {
      api: api,
      fallBack: MyCustomFallbackComponent,
      computed: {
        layout() {
          return this.$route.meta.layout;
        }
      }
    };
  },
  methods: {
    async getAuthentification() {
      // начальная проверка на открытую учётную запись
      try {
        await this.$store.dispatch('verifyJwt');

        this.$router.push({ path: '/projects' });
      } catch (err) {
        console.log(err);

        this.$router.push({ path: '/' });
      }
    }
  },
  created() {
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
