<template>
  <div class="all-body">
    <div id="components-demo">
      <auth-layout />
    </div>
    <p class="timer">{{ workTime }}</p>
    <div class="track-body">
      <input type="text" v-model="workName" />
      <button @click="trackingWorkTime(this.workName)">{{ workAppText }}</button>
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
            label="Update"
            severity="info"
            @click="
              updateWorkTime(item.id,item.task_name, item.begin_date, item.end_date)
            "
          />
          <Button
            label="Delete"
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
      workAppText: 'Start',
      workTime: '00:00',
      workName: '',
      time: { seconds: 0, minutes: 0, hours: 0 },
      nowWork: false,
      date: null,
      works: [],
      username: localStorage.getItem('login')
    };
  },
  name: 'TrackPage',
  methods: {
    async ShowWorkTime() {
      // console.log(localStorage.getItem('login'));
      // console.log(this.username);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.works = toRaw(
        await this.axios.post(
          process.env.VUE_APP_URL + '/track/list',
          { task_id: 1 },
          config
        )
      );

      this.works = this.works.data;

      // console.log(toRaw(this.works));
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

      this.ShowWorkTime();

      // console.log(toRaw(this.works));
    },
    async updateWorkTime(id_work,task_name, begin_date, end_date) {
      //token,task_name,begin_time, end_time
      console.log(id_work,task_name, begin_date, end_date);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.works = toRaw(
        await this.axios.post(
          process.env.VUE_APP_URL + '/track/update',
          { id_work:id_work,task_name: task_name, begin_date: begin_date, end_date: end_date },
          config
        )
      );

      this.ShowWorkTime();

      // console.log(toRaw(this.works));
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
        await this.axios.post(
          process.env.VUE_APP_URL + '/track/start',
          { task_name: task_name },
          config
        );

        this.workAppText = 'Stop';
        this.nowWork = true;
      } else {
        await this.axios.post(
          process.env.VUE_APP_URL + '/track/stop',
          {},
          config
        );

        this.workAppText = 'Start';
        this.nowWork = false;
        this.time.minutes = 0;
        this.time.hours = 0;
        this.time.seconds = 0;
      }

      this.ShowWorkTime();
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
    },
    viewDate() {
      console.log(this.date);
    }
  },
  mounted() {
    this.beginInterface();
    this.ShowWorkTime();
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
  line-height: 5;
  display: inline-flex;
  /* transform: translate(10%, 170%); */
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
