<template>
  <div class="track">
    <Menubar />
    <p class="track__timer">{{ workTime }}</p>
    <div class="track__header">
      <div class="invite-controls">
        <input
          class="track__header-input"
          v-if="selectedTeam == 'Без команды'"
          type="text"
          placeholder="Назовите задание"
          v-model="workName"
        />
        <button
          @click="trackingWorkTime(this.workName)"
          class="track__header-button"
        >
          {{ workAppText }}
        </button>
      </div>
    </div>
    <div class="track__works">
      <div v-for="item in formattedWorks" :key="item">
        <div class="track__works__crudbody">
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
            v-model="item.formattedBegin"
            @input="item.begin_date = $event.target.value"
          />
          Конец:<input
            type="text"
            class="track__works__crudbody-input"
            placeholder="дата окончания"
            v-model="item.formattedEnd"
            @input="item.end_date = $event.target.value"
          />
          <div class="track__works__crudbody__buttongroup">
            <button
              class="update-btn"
              v-if="item.task_id == null"
              @click="
                updateWorkTime(
                  item.id,
                  item.task_name,
                  this.parseDateFormatted(item.formattedBegin),
                  item.formattedEnd !== 'В процессе'
                    ? this.parseDateFormatted(item.formattedEnd)
                    : null
                )
              "
            >
              Изменить
            </button>
            <button class="delete-btn" @click="deleteWorkTime(item.id)">
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
  computed: {
    formattedWorks() {
      return this.works.map((work) => ({
        ...work,
        formattedBegin: this.formatDate(work.begin_date),
        formattedEnd: work.end_date
          ? this.formatDate(work.end_date)
          : 'В процессе'
      }));
    }
  },
  methods: {
    parseDateFormatted(formattedDate) {
      if (formattedDate === 'В процессе') return null;

      // Формат: "дд.мм.гггг, чч:мм:сс.мс"
      const [datePart, timePart] = formattedDate.split(', ');
      const [day, month, year] = datePart.split('.');
      const [time, milliseconds] = timePart.split('.');
      const [hours, minutes, seconds] = time.split(':');

      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds),
        parseInt(milliseconds)
      ).toISOString();
    },
    formatDate(isoDate) {
      if (!isoDate) return 'В процессе';
      const date = new Date(isoDate);
      return (
        date.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + `.${date.getMilliseconds().toString().padStart(3, '0')}`
      );
    },
    async showWorkTime() {
      // показ рабочего времени пользователя в одиночку, при выборе команды- в этой команде
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.works = await this.axios.get(
        process.env.VUE_APP_URL + '/track/list',
        config
      );

      this.works = toRaw(this.works.data);
    },
    async deleteWorkTime(id_work) {
      // удаление записи о рабочем времени
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      // const response =
      await this.axios.delete(
        process.env.VUE_APP_URL + '/track/delete' + `/${id_work}`,
        config
      );

      // this.works = toRaw(response.data);

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

      // this.works = toRaw(
      await this.axios.patch(
        process.env.VUE_APP_URL + '/track/update',
        {
          id_work: id_work,
          task_name: task_name,
          begin_date: begin_date,
          end_date: end_date
        },
        config
      );
      // );

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
        this.workAppText = 'Начать';
      } else {
        const nowDate = new Date();

        this.workAppText = 'Закончить';
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
    this.timer();
  }
};
</script>
