<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        v-model:selectedKeys="selectedKeys"
      >
        <a-menu-item key="1">Трекинг</a-menu-item>
        <a-menu-item key="2">Прогресс</a-menu-item>
        <a-menu-item key="3">Cправка</a-menu-item>
        <a-menu-item class="site-header-content" @click="showModal"
          >Выход</a-menu-item
        >
        <a-modal
          v-model:open="open"
          title="Вы действительно хотите выйти?"
          ok-text="Да" 
          cancel-text="Нет"
          @ok="userLogout"
        >
        </a-modal>
      </a-menu>
    </a-layout-header>
    <a-layout-content></a-layout-content>
  </a-layout>
</template>

<script>
import { api } from '../api/index.js';

export default {
  name: 'SignIn',
  data() {
    return {
      api: api,
      open: false
    };
  },
  methods: {
    showModal() {
      this.open = true;
    },
    userLogout() {
      this.$store.dispatch('updateJwt', '');
      this.api.logout();
      this.$router.push({ path: '/' });
    }
  }
};
</script>

<style>
.site-layout-content {
  background: #fff;
}

.site-header-content {
  margin-left: auto;
  margin-right: 0;
}

#components-layout-demo-top .logo {
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top .logo {
  margin-right: 0;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}
</style>
