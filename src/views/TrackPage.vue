<template>
  <div class="all-body">
    <div id="components-demo">
      <auth-layout v-if="role == 'user'" />
      <admin-layout v-else />
    </div>
    <p class="timer">{{ workTime }}</p>
    <div class="track-body">
      <select
        v-model="selectedTeam"
        @click="this.selectTeam()"
        class="dropdown"
      >
        <option>Без команды</option>
        <option v-for="item in teams" :key="item">{{ item.name }}</option>
      </select>
      <input
        v-if="selectedTeam == 'Без команды'"
        type="text"
        placeholder="Назовите задание"
        v-model="workName"
      />
      <select
        v-else
        v-model="selectedTask"
        @click="this.selectTask()"
        class="dropdown"
      >
        <option v-for="item in tasks" :key="item">{{ item.name }}</option>
      </select>
      <button @click="trackingWorkTime(this.workName)">
        {{ workAppText }}
      </button>
    </div>
    <div class="works">
      <Panel v-for="item in works" :key="item" style="height: 100px">
        <div class="crud-body">
          <p class="m-0">
            Пользователь:
            <InputText
              type="text"
              class="crud"
              placeholder="Имя пользователя"
              v-model="this.username"
            />
            Задание:
            <InputText
              type="text"
              class="crud"
              placeholder="Задание"
              v-model="item.task_name"
            />
            Начало:<InputText
              type="text"
              class="crud"
              placeholder="дата начала"
              v-model="item.begin_date"
            />
            Конец:<InputText
              type="text"
              class="crud"
              placeholder="дата окончания"
              v-model="item.end_date"
            />
          </p>
          <Button
            label="Изменить"
            v-if="item.task_id == null"
            severity="info"
            @click="
              updateWorkTime(
                item.id,
                item.task_name,
                item.begin_date,
                item.end_date
              )
            "
          />
          <Button
            label="Удалить"
            severity="danger"
            @click="deleteWorkTime(item.id)"
          />
        </div>
      </Panel>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';

export default {
  data() {
    return {
      selectedTeam: 'Без команды',
      selectedTeamObj: {},
      selectedTask: 'Выберете задание',
      selectedTaskObj: {},
      workAppText: 'Начать',
      workTime: '00:00',
      workName: '',
      time: { seconds: 0, minutes: 0, hours: 0 },
      nowWork: false,
      date: null,
      works: [],
      teams: [],
      tasks: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role')
    };
  },
  name: 'TrackPage',
  methods: {
    async showWorkTime() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      if (this.selectedTeam == 'Без команды') {
        this.works = toRaw(
          await this.axios.post(
            process.env.VUE_APP_URL + '/track/list',
            {},
            config
          )
        );
      } else {
        this.works = toRaw(
          await this.axios.post(
            process.env.VUE_APP_URL + '/track/list',
            { team_id: toRaw(this.selectedTeamObj).id },
            config
          )
        );
      }

      this.works = this.works.data;
    },
    async showTeam() {
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

      this.showTasks();
    },
    async selectTeam() {
      if (this.selectedTeam !== 'Без команды') {
        this.selectedTeamObj = this.teams.find(
          (item) => item.name == this.selectedTeam
        );
      }

      await this.showTasks();
      if (this.tasks.length !== 0) {
        this.selectedTask = toRaw(this.tasks[0]).name;
        await this.selectTask();
      }
      this.showWorkTime();
    },
    async selectTask() {
      if (this.selectedTeam !== 'Без команды' && this.tasks.length !== 0) {
        this.selectedTaskObj = this.tasks.find(
          (item) => item.name == this.selectedTask
        );
      }

      this.showTasks();
    },
    async showTasks() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.tasks = await this.axios.post(
        process.env.VUE_APP_URL + '/task/list',
        { team_id: toRaw(this.selectedTeamObj).id },
        config
      );

      this.tasks = toRaw(this.tasks);

      this.tasks = this.tasks.data;
    },
    async deleteWorkTime(id_work) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.works = toRaw(
        await this.axios.post(
          process.env.VUE_APP_URL + '/track/delete',
          { id_work: id_work },
          config
        )
      );

      this.showWorkTime();
    },
    async updateWorkTime(id_work, task_name, begin_date, end_date) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.works = toRaw(
        await this.axios.post(
          process.env.VUE_APP_URL + '/track/update',
          {
            id_work: id_work,
            task_name: task_name,
            begin_date: begin_date,
            end_date: end_date
          },
          config
        )
      );

      this.showWorkTime();
    },
    async trackingWorkTime(task_name) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };
      const { data } = await this.axios.post(
        process.env.VUE_APP_URL + '/track/status',
        {},
        config
      );

      if ((await data) == null) {
        if (this.selectedTeam == 'Без команды') {
          await this.axios.post(
            process.env.VUE_APP_URL + '/track/start',
            { task_name: task_name },
            config
          );

          this.workAppText = 'Закончить';
          this.nowWork = true;
        } else if (this.tasks.length !== 0) {
          await this.axios.post(
            process.env.VUE_APP_URL + '/track/start',
            {
              task_name: toRaw(this.selectedTaskObj).name,
              task_id: toRaw(this.selectedTaskObj).id
            },
            config
          );

          this.workAppText = 'Закончить';
          this.nowWork = true;
        }
      } else {
        await this.axios.post(
          process.env.VUE_APP_URL + '/track/stop',
          {},
          config
        );

        this.workAppText = 'Начать';
        this.nowWork = false;
        this.time.minutes = 0;
        this.time.hours = 0;
        this.time.seconds = 0;
      }

      this.showWorkTime();
    },
    async beginInterface() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };
      const { data } = await this.axios.post(
        process.env.VUE_APP_URL + '/track/status',
        {},
        config
      );

      if ((await data) == null) {
        this.workAppText = 'Start';
      } else {
        const nowDate = new Date();

        this.workAppText = 'Stop';
        this.nowWork = true;
        this.time.seconds = Math.floor(
          (nowDate - Date.parse(data.begin_date)) / 1000
        );
        this.time.minutes = Math.floor(this.time.seconds / 60);
        this.time.hours = Math.floor(this.time.seconds / 3600);
        this.time.seconds = this.time.seconds % 60;
      }
    },
    timer() {
      setInterval(() => {
        if (this.nowWork == true) {
          if (this.time.seconds === 60) {
            this.time.minutes++;
            this.time.seconds = 0;
          }

          if (this.time.minutes === 60) {
            this.time.hours++;
            this.time.minutes = 0;
          }

          if (this.time.hours === 0) {
            if (this.time.seconds < 10 && this.time.minutes < 10)
              this.workTime = `0${this.time.minutes}:0${this.time.seconds}`;
            else if (this.time.seconds >= 10 && this.time.minutes < 10)
              this.workTime = `0${this.time.minutes}:${this.time.seconds}`;
            else if (this.time.seconds < 10 && this.time.minutes >= 10)
              this.workTime = `${this.time.minutes}:0${this.time.seconds}`;
            else this.workTime = `${this.time.minutes}:${this.time.seconds}`;
          } else {
            if (this.time.hours < 10 && this.time.minutes < 10)
              this.workTime = `0${this.time.hours}:0${this.time.minutes}`;
            else if (this.time.hours >= 10 && this.time.minutes < 10)
              this.workTime = `${this.time.hours}:0${this.time.minutes}`;
            else if (this.time.hours < 10 && this.time.minutes >= 10)
              this.workTime = `0${this.time.hours}:${this.time.minutes}`;
            else this.workTime = `${this.time.hours}:${this.time.minutes}`;
          }

          this.time.seconds++;
        } else {
          this.workTime = '00:00';
        }
      }, 1000);
    }
  },
  mounted() {
    this.beginInterface();
    this.showWorkTime();
    this.showTeam();
    this.timer();
  }
};
</script>

<style>
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
</style>
