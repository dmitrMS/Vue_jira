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
              placeholder="Kолличество"
              v-model="item.number_team"
            />
            Teamlead:<InputText
              type="text"
              class="crud"
              placeholder="администратор"
              v-model="item.admin_username"
            />
          </p>
          <Button v-if="role == 'teamlead'" label="Информация" @click="infoTeam(item.id,item.name)" />
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
      user:{},
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

      for(let element of this.teams)
      {

        const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.user = await this.axios.post(
        process.env.VUE_APP_URL + '/admin/data',
        {admin_id: element.admin_id},
        config
      );
      // console.log(element.admin_id);

      element.admin_username=toRaw(this.user.data).login;
      // console.log(element.admin_username);
      console.log(toRaw(this.user.data));

      this.user = await this.axios.post(
        process.env.VUE_APP_URL + '/admin/data',
        {admin_id: element.admin_id},
        config
      );
      }

      for(let element of this.teams)
      {

        const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };


      let number_team={};
      number_team = await this.axios.post(
        process.env.VUE_APP_URL + '/user_team/list',
        {team_id: element.id},
        config
      );

      let countWork = 0;

      number_team.data.forEach(()=>{countWork++;});

      element.number_team=countWork;
      // console.log(toRaw(number_team.data));
      // console.log(toRaw(number_team.data.lenght));
      }

      console.log(this.teams);
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
    async infoTeam(team_id,team_name) {
      await this.$store.dispatch('updateTeamId', {team_id:team_id,team_name:team_name});
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
