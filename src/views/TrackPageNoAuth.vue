<template>
  <div class="all-body">
    <div id="components-demo">
      <no-auth-layout />
    </div>
    <p class="timer">{{ workTime }}</p>
    <div class="track-body">
      <input type="text" v-model="workName" />
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
export default {
  data() {
    return {
      workAppText: 'Начать',
      workTime: '00:00',
      workName: '',
      time: { seconds: 0, minutes: 0, hours: 0 },
      nowWork: false,
      date: null,
      works: [],
      username: 'Гость',
      role: 'Гость'
    };
  },
  name: 'TrackPageNoAuth',
  methods: {
    async ShowWorkTime() {
      this.works = await this.$store.dispatch('showWorks');
    },
    async deleteWorkTime(id_work) {
      await this.$store.dispatch('deleteWorks', id_work);

      this.ShowWorkTime();
    },
    async updateWorkTime(id_work, task_name, begin_date, end_date) {
      await this.$store.dispatch('updateWorks', {id_work: id_work, task_name: task_name, begin_date: begin_date, end_date: end_date});

      this.ShowWorkTime();
    },
    async trackingWorkTime(task_name) {
      let data = await this.$store.dispatch('statusWorks');

      if (data == null) {
        const work = {
          task_name: task_name,
          begin_date: new Date()
        };

        await this.$store.dispatch('createWorks', work);

        this.workAppText = 'Закончить';
        this.nowWork = true;

      } else {
        data.end_date = new Date();
        await this.$store.dispatch('stopWorks', data);

        this.workAppText = 'Начать';
        this.nowWork = false;
        this.time.minutes = 0;
        this.time.hours = 0;
        this.time.seconds = 0;
      }

      this.ShowWorkTime();
    },
    async beginInterface() {
      const data = await this.$store.dispatch('statusWorks');

      if (data == null) {
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
