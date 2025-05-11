<template>
  <div class="menubar">
    <ul class="menu">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        @click="selectItem(index)"
        :class="selectedIndex === index ? 'menu__li-active' : 'menu__li'"
      >
        <span class="menu__li-a">
          {{ item.label }}
        </span>
      </li>
    </ul>
    <div class="menu-icon" @click="toggleDropdown">
      <img src="@/assets/menu.svg" alt="Menu" loading="lazy" />
    </div>

    <!-- Мобильное меню -->
    <ul class="dropdown-menu" v-if="isMobileMenuVisible">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        @click="selectItem(index)"
        :class="selectedIndex === index ? 'menu__li-active' : 'menu__li'"
      >
        <span class="menu__li-a">{{ item.label }}</span>
      </li>
    </ul>
  </div>

  <!-- Динамически отображаемый компонент -->
  <!-- <component :is="currentComponent" /> -->
  <component
  :is="currentComponent"
  :project_id="project_id"
  :project_name="project_name"
  :tasks="this.projectTasks"
  :teamUsers="this.teamUsers"
  :statusOptions="this.statusOptions"
  :priorityOptions="this.priorityOptions"
/>
</template>

<script>
import { toRaw } from 'vue';

export default {
  name: 'TaskMenubar',
  data() {
    return {
      selectedIndex: 0,
      isMobileMenuVisible: false,
      menuItems: [
        { label: 'Задачи', component: 'projectTasks' },
        { label: 'Диаграмма Ганта', component: 'ganttChart' },
        { label: 'Команда', component: 'teamProject' }
      ],
      projectTasks: [],
      statusOptions: [],
      priorityOptions: [],
      teamUsers: []
    };
  },
  props: {
    project_id: {
      type: Number,
      required: true
    },
    project_name: {
      type: String,
      required: true
    }
  },
  // watch: {
  //   project_id: {
  //     immediate: true,
  //     handler(newId) {
  //       if (newId) {
  //         this.showTask(newId);
  //       }
  //     }
  //   }
  // },
  computed: {
    currentComponent() {
      return this.menuItems[this.selectedIndex].component;
    }
  },
  methods: {
    async ShowUserTeam() {
      // показать участиков команды
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.teamUsers = toRaw(
        await this.axios.get(
          process.env.VUE_APP_URL +
            `/user_team/list/${Number(this.project_id)}`,
          config
        )
      );

      this.teamUsers = this.teamUsers.data;
      // console.log(this.teamUsers);
    },
    async installStatus() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      const response = await this.axios.get(
        process.env.VUE_APP_URL + `/status/list`,
        config
      );
      this.statusOptions = response.data;
    },

    async installPriority() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      const response = await this.axios.get(
        process.env.VUE_APP_URL + `/priority/list`,
        config
      );
      this.priorityOptions = response.data;
    },
    selectItem(index) {
      this.selectedIndex = index;
      this.isMobileMenuVisible = false;
    },
    toggleDropdown() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
    },
    async showTask() {
      // показание заданий команды
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.projectTasks = toRaw(
        await this.axios.get(
          process.env.VUE_APP_URL +
            `/project/tasks/list/${Number(this.project_id)}`,
          config
        )
      );

      this.projectTasks = this.projectTasks.data;
    }
  },
  mounted() {
    this.showTask();
    this.installStatus();
    this.installPriority();
    this.ShowUserTeam();
  }
};
</script>
