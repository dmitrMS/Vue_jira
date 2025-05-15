<template>
  <div class="team">
    <div v-if="this.role_id == 1" class="team-header">
      <h2>Управление командой проекта: {{ project_name }}</h2>
      <div class="invite-controls">
        <input
          type="text"
          class="invite-input"
          placeholder="Введите логин пользователя"
          v-model="userLogin"
          @keyup.enter="inviteUser(userLogin)"
        />
        <button
          class="invite-button"
          @click="inviteUser(userLogin)"
          :disabled="!userLogin"
        >
          Отправить приглашение
        </button>
      </div>
    </div>
    <div v-else class="team-header">
      <h2>Команда проекта: {{ project_name }}</h2>
    </div>

    <div class="notification" v-if="notification.show">
      <div class="notification-content" :class="notification.type">
        {{ notification.message }}
        <button @click="hideNotification" class="notification-close">×</button>
      </div>
    </div>

    <div class="team__users">
      <div v-for="item in teamUsers" :key="item.user_id" class="user-row">
        <div class="user-crud">
          <span class="field">
            <label>Логин:</label>
            <input
              type="text"
              v-model="item.login"
              class="crud-input"
              placeholder="логин"
            />
          </span>
          <span class="field">
            <label>Роль:</label>
            <select v-model="item.role_id" class="crud-select">
              <option
                v-for="role in roleOptions"
                :value="role.id"
                :key="role.id"
              >
                {{ role.name }}
              </option>
            </select>
          </span>
          <div class="team_users_user-crud__buttongroup" v-if="this.role_id == 1">
            <button
              @click="updateRole(item.user_team_id, item.role_id)"
              class="update-btn"
            >
              Изменить
            </button>
            <button
              @click="deleteUserTeam(item.user_team_id)"
              class="delete-btn"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';
import './TeamProject.css';

export default {
  data() {
    return {
      userLogin: '',
      nowWork: false,
      visible: false,
      teamId: localStorage.getItem('team_id'),
      teamUsers: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role'),
      notification: {
        show: false,
        message: '',
        type: 'success'
      },
      showConfirmDialog: false,
      roleOptions: []
    };
  },
  computed: {
    role_id() {
      return this.$store.state.role_id;
    }
  },
  name: 'UserTeamPage',
  props: {
    project_id: {
      type: Number,
      required: true
    },
    project_name: {
      type: String,
      required: true
    },
  },
  watch: {
    project_id: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.ShowUserTeam(newId);
        }
      }
    }
  },
  methods: {
    async installRole() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.roleOptions = await this.axios.get(
        process.env.VUE_APP_URL + `/role/list`,
        config
      );

      this.roleOptions = this.roleOptions.data;
    },
    async updateRole(user_team_id, role_id) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.patch(
        process.env.VUE_APP_URL + `/user_team/update/${user_team_id}`,
        { role_id: role_id },
        config
      );

      this.ShowUserTeam();
    },
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
    },
    async deleteUserTeam(user_team_id) {
      // удалить участника команды
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.delete(
        process.env.VUE_APP_URL +
          '/user_team/delete' +
          `/${user_team_id}`,
        config
      );

      this.ShowUserTeam();
    },
    async inviteUser(login) {
      // пригласть участника в команду
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };
      await this.axios.post(
        process.env.VUE_APP_URL + '/team/add_user',
        {
          login: login,
          project_id: this.project_id,
          project_name: this.project_name
        },
        config
      );

      this.showNotification(
        `Приглашение отправлено пользователю ${login}`,
        'success'
      );

      this.visible = true;
    },
    showNotification(message, type = 'success') {
      this.notification = {
        show: true,
        message,
        type
      };

      // Автоматическое скрытие через 5 секунд
      setTimeout(() => {
        this.hideNotification();
      }, 5000);
    },
    hideNotification() {
      this.notification.show = false;
    }
  },
  mounted() {
    this.ShowUserTeam();
    this.installRole();
  }
};
</script>
