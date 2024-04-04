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
        <template #end>
          <div class="exit">
          <p class="login">{{ this.username }}</p>
          <Button class="button" @click="this.userLogout" severity="contrast">Выйти</Button>
          </div>
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
          label: 'Трэкинг',
          icon: 'pi pi-link',
          command: () => {
            this.$router.push('/track');
          }
        },
        {
          label: 'Информация об аккаунте',
          icon: 'pi pi-link',
          command: () => {
            this.$router.push('/track/account');
          }
        },
        {
          label: 'Команда',
          icon: 'pi pi-link',
          command: () => {
            this.$router.push('/team');
          }
        },
        {
          label: 'Уведомления',
          icon: 'pi pi-link',
          command: () => {
            this.$router.push('/notifications');
          }
        }
      ]
    };
  },
  methods: {
    userLogout() {
      this.$store.dispatch('logoutJwt');
      this.$router.push({ path: '/' });
    }
  }
};
</script>

<style>
.layout-auth {
  position: right fixed;
}
</style>

<style scoped>
html {
  margin: 0;
}
body {
  margin: 0;
}

.exit {
  margin-right: 20px;
  font-size: 16pt;
  display: inline-flex;
}

.exit .login{
  margin-right: 20px;
}

.exit .button{
  margin-block: auto;
  height: 30px;
}
</style>
