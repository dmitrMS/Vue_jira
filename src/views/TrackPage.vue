<template>
  <div id="components-demo">
    <auth-layout> </auth-layout>
  </div>
  <div class="all-body">
    <p class="timer">{{ workTime }}</p>
    <div class="track-body">
      <input type="text" />
      <button @click="trackingWorkTime">{{ workAppText }}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workAppText: 'Start',
      workTime: '00:00',
      time: { seconds: 0, minutes: 0, hours: 0 },
      nowWork: false
    };
  },
  name: 'TrackPage',
  methods: {
    userLogout() {
      this.$store.dispatch('logoutJwt');
      this.$router.push({ path: '/' });
    },
    async trackingWorkTime() {
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
          {},
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
  transform: translate(10%, 170%);
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
</style>
