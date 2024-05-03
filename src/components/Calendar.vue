<template>
  <div class="wrap">
    <div class="left">
      <DayPilotNavigator id="nav" :config="navigatorConfig" />
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
      events: [],
      navigatorConfig: {
        showMonths: 2,
        skipMonths: 2,
        selectMode: 'Week',
        startDate: '2024-05-01',
        selectionDay: '2024-05-02',
        onTimeRangeSelected: (args) => {
          this.config.startDate = args.day;
        }
      },
      // конфигурационные параметры календаря
      config: {
        viewType: 'Week',
        startDate: '2024-05-01',
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
      return this.$refs.calendar.control;
    }
  },
  methods: {
    async loadEvents() {
      // создание видимости работ на календаре
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

      const events = [];

      works.forEach((element) => {
        const item = {
          id: element.id,
          start: element.begin_date,
          end: element.end_date,
          text: element.task_name,
          backColor: '#0d701ed7',
          borderColor: '#38761d'
        };
        events.push(item);
      });

      this.calendar.update({ events });
    }
  },
  mounted() {
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
