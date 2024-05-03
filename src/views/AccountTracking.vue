<template>
  <div class="all-body">
    <div id="components-demo">
      <auth-layout v-if="role == 'user'" />
      <admin-layout v-else />
      <h2>Статистика</h2>
      <Panel class="info">
        <div class="crud-body">
          <p>Пользователь: {{ username }}</p>
          <p style="margin: 15px">Работ за день: {{ workDay }}</p>
          <p style="margin: 15px">Работ за месяц: {{ workMonth }}</p>
        </div>
      </Panel>
      <calendar-time />
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';

export default {
  name: 'AccountTracking',
  data() {
    return {
      workDay: 0,
      username: localStorage.getItem('login'),
      workMonth: 0
    };
  },
  methods: {
    async getStatistics() {
      // вывод статистики о рабочем времени пользователя за день и месяц
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };
      let works = toRaw(
        await this.axios.get(
          process.env.VUE_APP_URL + '/track/list',
          { task_id: 1 },
          config
        )
      );

      works = works.data;

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
    }
  },
  mounted() {
    this.getStatistics();
  }
};
</script>

<style>
.authbodysignin {
  background-color: #7ab7f0d7;
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.authbodysignin .auth input {
  background-color: #7ab7f000;
  border: 0;
  border-bottom: 2px solid #000000;
  width: 200px;
  opacity: 100%;
}

.authbodysignin .auth input:focus {
  outline: none;
}

.authbodysignin a {
  color: #000000d7;
  font-size: 16pt;
}

.authbodysignin button {
  background-color: #2e78bdd7;
  color: #ffffffd7;
  border: 0px solid;
  width: 200px;
  height: 60px;
  font-size: 16pt;
  font-weight: normal;
  border-radius: 30px;
  margin: 2%;
}

.authbodysignin h1 {
  font-weight: normal;
}

.authbodysignin .txt {
  text-align: center;
  font-style: italic;
  line-height: 5;
  transform: translate(0%, 25%);
}

.authbodysignin .auth {
  font-size: 16pt;
  line-height: 0;
}

.authbodysignin .fon {
  background-color: #7ab7f0d7;
  background-position: bottom right;
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.info {
  width: 800px;
  height: 100px;
  margin: 20px;
}
</style>
