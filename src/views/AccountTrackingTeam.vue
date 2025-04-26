<template>
  <div class="all-body">
    <div id="components-demo">
      <admin-layout />
      <h2>Статистика</h2>
      <div class="team">
        <p style="margin: 0%">Команда:</p>
        <select
          v-model="selectedTeam"
          @click="this.selectTeam()"
          class="dropdown"
        >
          <option v-for="item in teams" :key="item">{{ item.name }}</option>
        </select>
      </div>
      <Panel class="info">
        <div class="crud-body">
          <p>Пользователь: {{ username }}</p>
          <p style="margin: 15px">Работ за день: {{ workDay }}</p>
          <p style="margin: 15px">Работ за месяц: {{ workMonth }}</p>
        </div>
      </Panel>
      <calendar-time-team :key="this.teamId" />
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';

export default {
  name: 'AccountTrackingTeam',
  data() {
    return {
      workDay: 0,
      username: localStorage.getItem('login'),
      teamId: localStorage.getItem('team_id_cal'),
      workMonth: 0,
      selectedTeam: 'Без команды',
      selectedTeamObj: {},
      teams: []
    };
  },
  methods: {
    async getStatistics() {
      // вывод статистик работ за день и месяц
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      let works = toRaw(
        await this.axios.post(
          process.env.VUE_APP_URL + `/team/track/list/${Number(this.teamId)}`,
          // { team_id: Number(this.teamId) },
          config
        )
      );

      works = works.data;
      this.workMonth = 0;
      this.workDay = 0;

      works.forEach((element) => {
        const now = new Date();
        const date = element.begin_date.split('');
        const year = date[0] + date[1] + date[2] + date[3];
        const month = date[5] + date[6];
        const day = date[8] + date[9];
        let monthNow = 0;

        if (now.getMonth() > 9) {
          monthNow = now.getMonth() + 1;
        } else {
          monthNow = '0' + (now.getMonth() + 1);
        }
        if (year == now.getFullYear() && month == monthNow) {
          this.workMonth += 1;
          if (day == now.getDate()) this.workDay += 1;
        }
      });
    },
    async showTeam() {
      // вывод списка команд
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.teams = await this.axios.get(
        process.env.VUE_APP_URL + '/team/list',
        // {},
        config
      );

      this.teams = toRaw(this.teams);

      this.teams = this.teams.data;

      if (this.teams.length !== 0) {
        this.selectedTeam = toRaw(this.teams[0]).name;

        await this.selectTeam();
      }
    },
    async selectTeam() {
      // выбор необходимой команды
      this.selectedTeamObj = await this.teams.find(
        (item) => item.name == this.selectedTeam
      );

      await this.$store.dispatch('updateTeamIdCal', this.selectedTeamObj.id);
      this.teamId = this.selectedTeamObj.id;

      this.getStatistics();
    }
  },

  mounted() {
    this.showTeam();
  }
};
</script>

<style scoped>
.all-body {
  background-color: #7ab7f0d7;
  background-position: bottom right;
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.track-body {
  margin: 0 0;
  font-style: italic;
  display: inline-flex;
}

.track-body .dropdown {
  height: 40px;
  margin-right: 20px;
}

.track-body input {
  border: 0px solid;
  border-radius: 30px;
  height: 35px;
  width: 1200px;
  opacity: 100%;
}

.track-body button {
  background-color: #16558fd7;
  color: #ffffffd7;
  border: 0px solid;
  width: 200px;
  height: 60px;
  font-size: 16pt;
  font-weight: normal;
  transform: translate(15%, -20%);
}

.all-body .timer {
  font-size: 16pt;
  line-height: 0;
}

.all-body .crud {
  border: 0px solid;
  height: 10px;
  margin-left: 15px;
  margin-right: 15px;
}

.crud-body {
  display: inline-flex;
}

.crud-body button {
  height: 30px;
  margin-left: 15px;
}

.all-body .team {
  text-align: start;
  margin-left: 20px;
  font-size: 16pt;
}

.all-body .team select {
  width: 20%;
}
</style>
