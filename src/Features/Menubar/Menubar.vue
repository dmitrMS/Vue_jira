<template>
  <nav class="menubar">
    <div class="menu__user-login">
      <p>Ваш логин: {{ this.userLogin }}</p>
    </div>
    <ul class="menu">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        @click="selectItem(index)"
        :class="selectedIndex === index ? 'menu__li-active' : 'menu__li'"
      >
        <router-link :to="item.route" href="#" class="menu__li-a"
          >{{ item.label }}
          <span
            v-if="item.label === 'Уведомления' && notificationsCount > 0"
            class="notification-badge"
          >
            {{ notificationsCount }}
          </span></router-link
        >
      </li>
      <a href="#" @click="userLogout()" class="menu__li__social"
        >Выйти из аккаунта</a
      >
    </ul>
    <div class="menu-icon" @click="toggleDropdown">
      <img src="@/assets/menu.svg" alt="Menu" loading="lazy" />
    </div>
    <ul class="dropdown-menu" v-if="isMobileMenuVisible">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        @click="selectItem(index)"
        :class="selectedIndex === index ? 'menu__li-active' : 'menu__li'"
      >
        <router-link :to="item.route" href="#" class="menu__li-a"
          >{{ item.label }}
          <span
            v-if="item.label === 'Уведомления' && notificationsCount > 0"
            class="notification-badge"
          >
            {{ this.notificationsCount }}
          </span>
        </router-link>
      </li>
      <a href="#" @click="userLogout()" class="menu__li__social"
        >Выйти из аккаунта</a
      >
    </ul>
  </nav>
</template>

<script>
import './Menubar.css';
import { toRaw } from 'vue';

export default {
  name: 'Menubar',
  data() {
    return {
      // Пункты меню
      menuItems: [
        { label: 'Проекты', route: '/projects' },
        { label: 'Трэкинг', route: '/track' },
        { label: 'Уведомления', route: '/notifications' }
      ],
      // Индекс выбранного пункта, по нему идёт опредение активности
      selectedIndex: null,
      isMobileMenuVisible: false,
      notificationsCount: 0,
      userLogin: localStorage.getItem('login')
    };
  },
  // computed: {
  //   userLogin() {
  //     return this.$store.state.login;
  //   }
  // },
  methods: {
    // Активация элемента
    selectItem(index) {
      this.selectedIndex = index;
      const targetRoute = this.menuItems[index].route;
      //   console.log(targetRoute );
      this.$router.push({ path: targetRoute });
    },
    toggleDropdown() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
    },
    userLogout() {
      // выход их учётной записи
      this.$store.dispatch('logoutJwt');
      this.$router.push({ path: '/' });
    },
    async fetchNotificationsCount() {
      // показ уведомлений о приглашении
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.notifications = toRaw(
        await this.axios.get(
          process.env.VUE_APP_URL + '/notification/list',
          // {},
          config
        )
      );

      this.notifications = this.notifications.data;
      this.notificationsCount = this.notifications?.length || 0;
      console.log(this.notificationsCount);
    }
  },
  mounted() {
    this.fetchNotificationsCount();
  }
};
</script>
