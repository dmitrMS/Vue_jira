<template>
  <div class="layout-auth">
    <div class="card">
      <Menubar :model="items">
        <template #item="{ item, props, hasSubmenu }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            v-ripple
            :href="item.url"
            :target="item.target"
            v-bind="props.action"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
          </a>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem('login'),
      items: [
        {
          label: 'Обзор',
          icon: 'pi pi-palette',
          command: () => {
            this.$router.push('/track/review');
          }
        },
        {
          label: 'Трэкинг',
          icon: 'pi pi-link',
          command: () => {
            this.$router.push('/guest/track');
          }
        },
        {
          label: 'Войти',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Авторизация',
              command: () => {
                this.$router.push('/');
              }
            },
            {
              label: 'Регистрация',
              command: () => {
                this.$router.push('/sign_up');
              }
            }
          ]
        }
      ]
    };
  }
};
</script>

<style>
.layout-auth {
  /* background-position: bottom left; */
  position: right fixed;
  /* width: 100vw; */
}
</style>

<style scoped>
html {
  margin: 0;
}
body {
  margin: 0;
}
</style>
