<template>
  <div class="track">
    <div id="components-demo">
      <auth-layout v-if="role == 'user'" />
      <admin-layout v-else />
    </div>
    <p class="track__timer">{{ workTime }}</p>
    <div class="track__parameters">
      <select
        v-model="selectedTeam"
        @click="this.selectTeam()"
        class="track__parameters-dropdown"
      >
        <option>Без команды</option>
        <option v-for="item in teams" :key="item">{{ item.name }}</option>
      </select>
      <input
        class="track__parameters-input"
        v-if="selectedTeam == 'Без команды'"
        type="text"
        placeholder="Назовите задание"
        v-model="workName"
      />
      <select
        v-else
        v-model="selectedTask"
        @click="this.selectTask()"
        class="track__parameters-dropdown"
      >
        <option v-for="item in tasks" :key="item">{{ item.name }}</option>
      </select>
      <button
        @click="trackingWorkTime(this.workName)"
        class="track__parameters-button"
      >
        {{ workAppText }}
      </button>
    </div>
    <div class="track__works">
      <div v-for="item in works" :key="item">
        <div class="track__works__crudbody">
          <!-- <div class="track__works__crudbody-p"> -->
          Пользователь:
          <input
            type="text"
            class="track__works__crudbody-input"
            placeholder="Имя пользователя"
            v-model="this.username"
          />
          Задание:
          <input
            type="text"
            class="track__works__crudbody-input"
            placeholder="Задание"
            v-model="item.task_name"
          />
          Начало:<input
            type="text"
            class="track__works__crudbody-input"
            placeholder="дата начала"
            v-model="item.begin_date"
          />
          Конец:<input
            type="text"
            class="track__works__crudbody-input"
            placeholder="дата окончания"
            v-model="item.end_date"
          />
          <!-- </div> -->
          <div class="track__works__crudbody__buttongroup">
            <button
              class="track__works__crudbody__buttongroup-button"
              v-if="item.task_id == null"
              @click="
                updateWorkTime(
                  item.id,
                  item.task_name,
                  item.begin_date,
                  item.end_date
                )
              "
            >
              Изменить
            </button>
            <button
              class="track__works__crudbody-button"
              @click="deleteWorkTime(item.id)"
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
import './TrackPage.css';

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
      // показ рабочего времени пользователя в одиночку, при выборе команды- в этой команде
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      if (this.selectedTeam == 'Без команды') {
        this.works = toRaw(
          await this.axios.get(process.env.VUE_APP_URL + '/track/list', config)
        );
      } else {
        console.log(toRaw(this.selectedTeamObj).id);
        this.works = toRaw(
          await this.axios.get(
            process.env.VUE_APP_URL +
              `/track/list/${toRaw(this.selectedTeamObj).id}`,
            // { team_id: toRaw(this.selectedTeamObj).id },
            config
          )
        );
      }

      this.works = this.works.data;
    },
    async showTeam() {
      // показ списка команд
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.teams = await this.axios.get(
        process.env.VUE_APP_URL + '/team/list',
        config
      );

      this.teams = toRaw(this.teams);

      this.teams = this.teams.data;

      // this.showTasks();
    },
    async selectTeam() {
      // выбор команды
      if (this.selectedTeam !== 'Без команды') {
        this.selectedTeamObj = this.teams.find(
          (item) => item.name == this.selectedTeam
        );
        await this.showTasks();
      }

      // await this.showTasks();
      try {
        if (this.tasks.length !== 0) {
          this.selectedTask = toRaw(this.tasks[0]).name;
          await this.selectTask();
        }
        this.showWorkTime();
      } catch (err) {
        this.showWorkTime();
      }
    },
    async selectTask() {
      // выбор командного задания для трэкинга
      if (this.selectedTeam !== 'Без команды' && this.tasks.length !== 0) {
        this.selectedTaskObj = this.tasks.find(
          (item) => item.name == this.selectedTask
        );
      }

      this.showTasks();
    },
    async showTasks() {
      // показ командных заданий
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      // console.log(toRaw(this.selectedTeamObj).id);
      this.tasks = await this.axios.get(
        process.env.VUE_APP_URL +
          `/task/list/${toRaw(this.selectedTeamObj).id}`,
        // { team_id: toRaw(this.selectedTeamObj).id },
        config
      );

      this.tasks = toRaw(this.tasks);

      this.tasks = this.tasks.data;
    },
    async deleteWorkTime(id_work) {
      // удаление записи о рабочем времени
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.works = toRaw(
        await this.axios.delete(
          process.env.VUE_APP_URL + '/track/delete' + `/${id_work}`,
          config
        )
      );

      this.showWorkTime();
    },
    async updateWorkTime(id_work, task_name, begin_date, end_date) {
      // обновление одиночного рабочего времени
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.works = toRaw(
        await this.axios.patch(
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
      // запустить начало рабочего времени
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };
      const { data } = await this.axios.get(
        process.env.VUE_APP_URL + '/track/status',
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
      // обновление текущего таймера, поиск действующего рабочего времени
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };
      const { data } = await this.axios.get(
        process.env.VUE_APP_URL + '/track/status',
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
      // создание таймера
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
