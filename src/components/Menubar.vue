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
import '@/assets/styles/global.css';
export default {
  name: 'Menubar',
  data() {
    return {
      // Пункты меню
      menuItems: [{ label: "Проекты", route: "/projects" },
        { label: "Трэкинг", route: "/track" },
        { label: "Команда", route: "/team" },
        { label: "Диаграмма", route: "/diagram" },],
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

<style scoped>
.menubar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1%;
  padding-top: 1%;
  background-color: #ffff;
  color: black;
  border-bottom: 1px var(--border-color) solid;
  top: 0;
  width: 100%;
  background-size: cover;
}

.logo {
  margin-right: 10%;
  font-size: 24px;
  color: #fff;
}

.menu {
  list-style-type: none;
  display: flex;
  gap: 20px;
  margin: 0;
}

.menu-icon {
  position: fixed;
  right: 5%; /* Показываем иконку меню */
  display: none;
}

.menu__li {
  position: relative; /* Для псевдоэлемента, создающего подчеркивание */
  cursor: pointer;
}

.menu__li__social {
  text-decoration: none;
  color: var(--secondary-color);
}

.menu__li-a {
  color: black;
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
  display: inline;
  width: min-content;
  transition: font-size 5s ease;
  transition: padding 5s ease;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  background-color: var(--text-color-white);
  list-style-type: none;
  padding: 0;
  margin: 0;
  z-index: var(--z-index-dropdown);
}

@media (max-width: 1024px) {
  .menu__li-a {
    padding: 5px;
  }
}

@media (max-width: 768px) {
  .menubar {
    padding: 4%; /* Скрываем обычное меню */
  }

  .menu {
    display: none; /* Скрываем обычное меню */
  }

  .logo {
    margin-left: calc(10% - 5%);
    margin-right: auto;
  }

  .menu-icon {
    display: block; /* Показываем иконку меню */
  }

  .dropdown-menu {
    display: block; /* Показываем дропдаун, если меню активно */
  }
}
</style>
