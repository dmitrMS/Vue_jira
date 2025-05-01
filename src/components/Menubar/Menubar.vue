<template>
  <nav class="menubar">
    <!-- <div class="logo">
        <img src="@/assets/CADesign.svg" loading="lazy" />
      </div> -->
    <ul class="menu">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        @click="selectItem(index)"
        :class="selectedIndex === index ? 'menu__li-active' : 'menu__li'"
      >
      <router-link :to="item.route" href="#" class="menu__li-a">{{ item.label }}</router-link>
      </li>
      <a href="#" @click="userLogout()" class="menu__li__social">Выйти из аккаунта</a>
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
      <router-link :to="item.route" href="#" class="menu__li-a">{{ item.label }}</router-link>
      </li>
      <a href="#" @click="userLogout()" class="menu__li__social">Выйти из аккаунта</a>
    </ul>
  </nav>
</template>

<script>
import './Menubar.css';

export default {
  name: 'Menubar',
  data() {
    return {
      // Пункты меню
      menuItems: [{ label: "Проекты", route: "/projects" },
        { label: "Трэкинг", route: "/track" },
        { label: "Команда", route: "/team" },],
      // Индекс выбранного пункта, по нему идёт опредение активности
      selectedIndex: null,
      isMobileMenuVisible: false
    };
  },
  methods: {
    // Активация элемента
    selectItem(index) {
        this.selectedIndex = index;
      const targetRoute = this.menuItems[index].route;
    //   console.log(targetRoute );
      this.$router.push({ path: targetRoute});
    },
    toggleDropdown() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
    },
    userLogout() {
      // выход их учётной записи
      this.$store.dispatch('logoutJwt');
      this.$router.push({ path: '/' });
    }
  }
};
</script>
