<template>
    <a-layout-header>
      <a-menu
        theme="dark"
        mode="horizontal"
        v-model:selectedKeys="selectedKeys"
      >
        <a-menu-item key="1">Обзор</a-menu-item>
        <a-menu-item key="2">Вход</a-menu-item>
        <dropdown>
          <a @click.prevent>
            Hover me
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;">1st menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">2nd menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">3rd menu item</a>
              </a-menu-item>
            </a-menu>
          </template>
        </dropdown>
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

</style>
