<template>
  <div class="wrap">
    <div class="left">
      <DayPilotNavigator
        id="nav"
        :config="navigatorConfig"
        :selectionDay="selectionDay"
        :startDate="startDate"
      />
    </div>
    <div class="content">
      <DayPilotCalendar id="dp" :config="config" ref="calendar" />
    </div>
  </div>
</template>

<script>
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator
} from '@daypilot/daypilot-lite-vue';
import { toRaw } from 'vue';

export default {
  name: 'Calendar',
  data: function () {
    return {
      teamId: localStorage.getItem('team_id_cal'),
      events: [],
      navigatorConfig: {
        showMonths: 2,
        skipMonths: 2,
        selectMode: 'Week',
        startDate: '2024-04-01',
        selectionDay: '2024-04-02',
        onTimeRangeSelected: (args) => {
          this.config.startDate = args.day;
        }
      },
      config: {
        viewType: 'Week',
        startDate: '2024-04-01',
        durationBarVisible: false,
        timeRangeSelectedHandling: 'Enabled',
        onTimeRangeSelected: async (args) => {
          const modal = await DayPilot.Modal.prompt(
            'Create a new event:',
            'Event 1'
          );
          const dp = args.control;
          dp.clearSelection();
          if (modal.canceled) {
            return;
          }
          dp.events.add({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result
          });
        },
        eventDeleteHandling: 'Disabled',
        onEventMoved: () => {
          console.log('Event moved');
        },
        onEventResized: () => {
          console.log('Event resized');
        }
      }
    };
  },
  props: {},
  components: {
    DayPilotCalendar,
    DayPilotNavigator
  },
  computed: {
    calendar() {
      // try {
      return this.$refs.calendar.control;
      // } catch (err) {
      //   console.log(err);
      // }
    }
  },
  methods: {
    async loadEvents() {
      // await this.loadData();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };
      let works = toRaw(
        await this.axios.post(
          process.env.VUE_APP_URL + '/team/track/list',
          { team_id: Number(this.teamId) },
          config
        )
      );

      const teamName = toRaw(
        await this.axios.post(
          process.env.VUE_APP_URL + '/team/info',
          { team_id: Number(this.teamId) },
          config
        )
      );

      works = works.data;

      const events = [];

      for (let element of works) {
        let userName = toRaw(
          await this.axios.post(
            process.env.VUE_APP_URL + '/admin/data',
            { admin_id: Number(element.user_id) },
            config
          )
        );

        const item = {
          id: element.id,
          start: element.begin_date,
          end: element.end_date,
          text: `Задание:${element.task_name} \n Пользователь:${userName.data.login} \n Команда:${teamName}`,
          backColor: '#0d701ed7',
          borderColor: '#38761d'
        };
        events.push(item);
      }

      this.calendar.update({ events });
    },
    async loadData() {
      const now = new Date();
      const year = now.getFullYear();
      let month = now.getMonth() + 1;

      if (now.getMonth() > 9) {
        month = now.getMonth() + 1;
      } else {
        month = '0' + now.getMonth();
      }

      let day = 0;
      let selectionDay = 0;

      if (now.getDate() > 9) {
        day = now.getDate();
        selectionDay = now.getDate();
      } else {
        day = '0' + now.getDate();
        selectionDay = '0' + (now.getDate() - 2);
      }

      this.startDate = `${year}-${month}-${day}`;
      this.selectionDay = `${year}-${month}-${selectionDay}`;
    }
  },
  mounted() {
    // this.loadData();
    this.loadEvents();
  }
};
</script>

<style>
.wrap {
  display: flex;
}

.left {
  margin-right: 10px;
}

.content {
  flex-grow: 1;
}

.calendar_default_event_inner {
  background: #2e78d6;
  color: white;
  border-radius: 5px;
  opacity: 0.9;
}
</style>
