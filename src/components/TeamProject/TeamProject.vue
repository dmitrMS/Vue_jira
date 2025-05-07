<template>
  <div class="team">
    <!-- <div id="components-demo">
        <auth-layout v-if="role == 'user'" />
        <admin-layout v-else />
        <team-layout />
      </div> -->
    <!-- <div class="team__parameters">
      <input
        type="text"
        class="team__parameters-input"
        placeholder="Введите логин пользователя"
        v-model="userLogin"
      />
      <button class="team__parameters-button" @click="inviteUser(this.userLogin)">
        Отправить приглашение
      </button>
    </div> -->
    <div class="team-header">
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
            <input type="text" v-model="item.login" class="crud-input" placeholder="логин" />
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
          <span class="field">
            <label>Работы:</label>
            <input type="number" v-model="item.numTeamWorks " class="crud-input num-input" min="0" />
          </span>
          <button @click="updateRole(item.id,item.team_id,item.role_id)" class="update-btn">
            Изменить роль
          </button>
          <button @click="deleteUserTeam(item.user_id, item.team_id)" class="delete-btn">
            <!-- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg> -->
            Удалить
          </button>
        </div>
      </div>
      <!-- <Dialog
        v-model:visible="visible"
        maximizable
        modal
        header="Сообщение"
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <p class="m-0">Приглашение отправлено пользователю</p>
      </Dialog> -->
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
      roleOptions : []
    };
  },
  name: 'UserTeamPage',
  props: {
    project_id: {
      type: Number,
      required: true
    },
    project_name: {
      type: Number,
      required: true
    }
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
      // console.log(this.statusOptions);

      this.roleOptions = this.roleOptions.data;
    },
    async updateRole(user_team_id,team_id,role_id) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.patch(
        process.env.VUE_APP_URL + `/user_team/update/${user_team_id}`,
        {role_id: role_id},
        config
      );
      // console.log(this.statusOptions);

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
          process.env.VUE_APP_URL + `/user_team/list/${Number(this.project_id)}`,
          config
        )
      );

      this.teamUsers = this.teamUsers.data;
      // console.log(this.teamUsers);
    },
    async deleteUserTeam(user_id, team_id) {
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
          `/${user_id}` +
          `/${team_id}`,
        // {},
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
        { login: login, project_id: this.project_id, project_name: this.project_name},
        config
      );

      this.showNotification(`Приглашение отправлено пользователю ${login}`, 'success');

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
    this.installRole()
  }
};
</script>
