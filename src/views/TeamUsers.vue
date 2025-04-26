<template>
  <div class="all-body">
    <div id="components-demo">
      <auth-layout v-if="role == 'user'" />
      <admin-layout v-else />
      <team-layout />
    </div>
    <div class="track-body">
      <input
        type="text"
        placeholder="Введите логин пользователя"
        v-model="userLogin"
      />
      <button @click="inviteUser(this.userLogin, this.teamId)">
        Отправить приглашение
      </button>
    </div>
    <div class="works">
      <Panel v-for="item in teamUsers" :key="item" style="height: 100px">
        <div class="crud-body">
          <p class="m-0">
            Логин:
            <InputText
              type="text"
              class="crud"
              placeholder="логин"
              v-model="item.login"
            />
            Роль:<InputText
              type="text"
              class="crud"
              placeholder="роль"
              v-model="item.role"
            />
            Колличество работ:<InputText
              type="text"
              class="crud"
              placeholder="работы"
              v-model="item.numTeamWorks"
            />
          </p>
          <Button
            label="Удалить"
            severity="danger"
            @click="deleteUserTeam(item.user_id, item.team_id)"
          />
        </div>
      </Panel>
      <Dialog
        v-model:visible="visible"
        maximizable
        modal
        header="Сообщение"
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <p class="m-0">Приглашение отправлено пользователю</p>
      </Dialog>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';

export default {
  data() {
    return {
      userLogin: '',
      nowWork: false,
      visible: false,
      teamId: localStorage.getItem('team_id'),
      teamUsers: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role')
    };
  },
  name: 'UserTeamPage',
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
          process.env.VUE_APP_URL + `/user_team/list/${Number(this.teamId)}`,
          // { team_id: Number(this.teamId) },
          config
        )
      );

      this.teamUsers = this.teamUsers.data;
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
        process.env.VUE_APP_URL + '/user_team/delete'+`/${user_id}`+`/${team_id}`,
        // {},
        config
      );

      this.ShowUserTeam();
    },
    async inviteUser(login, team_id) {
      // пригласть участника в команду
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };
      await this.axios.post(
        process.env.VUE_APP_URL + '/team/add_user',
        { login: login, team_id: team_id },
        config
      );

      this.visible = true;
    }
  },
  mounted() {
    this.ShowUserTeam();
  }
};
</script>
