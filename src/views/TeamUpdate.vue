<template>
  <div class="all-body">
    <div id="components-demo">
      <auth-layout v-if="role == 'user'" />
      <admin-layout v-else />
    </div>
    <h2>Список команд</h2>
    <div class="track-body">
      <input type="text" v-model="teamName" />
      <button @click="createTeam(this.teamName)">Создать</button>
    </div>
    <div class="works">
      <Panel v-for="item in teams" :key="item" style="height: 100px">
        <div class="crud-body">
          <p class="m-0">
            Название:
            <InputText
              type="text"
              class="crud"
              placeholder="Имя пользователя"
              v-model="item.name"
            />
            Колличество пользователей:
            <InputText
              type="text"
              class="crud"
              placeholder="Задание"
              v-model="item.task_name"
            />
            Teamlead:<InputText
              type="text"
              class="crud"
              placeholder="дата начала"
              v-model="item.begin_date"
            />
          </p>
          <Button v-if="role == 'teamlead'" label="Информация" @click="infoTeam(item.id)" />
          <Button
            label="Удалить"
            severity="danger"
            @click="deleteTeam(item.id)"
          />
        </div>
      </Panel>
      <Dialog v-model:visible="visible" maximizable modal header="Сообщение" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p class="m-0">
                Команда создана!
            </p>
        </Dialog>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';

export default {
  data() {
    return {
      teamName: '',
      nowWork: false,
      teams: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role')
    };
  },
  name: 'TeamPage',
  methods: {
    async ShowTeam() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.teams = await this.axios.post(
        process.env.VUE_APP_URL + '/team/list',
        {},
        config
      );

      this.teams = toRaw(this.teams);

      this.teams = this.teams.data;
    },
    async deleteTeam(team_id) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.post(
        process.env.VUE_APP_URL + '/team/delete',
        { team_id: team_id },
        config
      );

      this.ShowWorkTime();
    },
    async infoTeam(team_id) {
      await this.$store.dispatch('updateTeamId', team_id);
      this.$router.push('/user_team');
    },
    async createTeam(name) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.post(
        process.env.VUE_APP_URL + '/team/create',
        { name: name },
        config
      );

      this.ShowTeam();
    }
  },
  mounted() {
    this.ShowTeam();
  }
};
</script>
