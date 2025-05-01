<template>
  <div ref="ganttContainer"></div>
</template>

<script>
import { Gantt } from 'frappe-gantt';
import 'frappe-gantt/dist/frappe-gantt.css';

export default {
  name: 'VueFrappeGantt',
  props: {
    tasks: {
      type: Array,
      required: true,
      default: () => [],
      validator: (value) => {
        return value.every(task => 
          task.id && 
          task.name && 
          task.start && 
          task.end
        );
      }
    },
    options: {
      type: Object,
      default: () => ({
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
        bar_height: 20,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        view_mode: 'Day',
        date_format: 'YYYY-MM-DD',
        custom_popup_html: null,
        on_click: null,
        on_date_change: null,
        on_progress_change: null,
        on_view_change: null
      })
    }
  },
  data() {
    return {
      gantt: null
    };
  },
  watch: {
    tasks: {
      handler(newTasks) {
        if (this.gantt) {
          this.gantt.refresh(newTasks);
        }
      },
      deep: true
    },
    options: {
      handler() {
        if (this.gantt) {
          // Для изменения options нужно пересоздать Gantt
          this.initializeGantt();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initializeGantt();
  },
  beforeUnmount() {
    if (this.gantt) {
      // Очистка при уничтожении компонента
      this.$refs.ganttContainer.innerHTML = '';
    }
  },
  methods: {
    initializeGantt() {
      if (this.gantt) {
        this.$refs.ganttContainer.innerHTML = '';
      }

      this.gantt = new Gantt(this.$refs.ganttContainer, this.tasks, this.options);

      // Пробрасываем события
      if (this.options.on_click) {
        this.gantt.bind('click', this.options.on_click);
      }
      if (this.options.on_date_change) {
        this.gantt.bind('date_change', this.options.on_date_change);
      }
      if (this.options.on_progress_change) {
        this.gantt.bind('progress_change', this.options.on_progress_change);
      }
      if (this.options.on_view_change) {
        this.gantt.bind('view_change', this.options.on_view_change);
      }

      // Эмитим события Vue
      this.gantt.bind('click', (task) => {
        this.$emit('task-click', task);
      });
      this.gantt.bind('date_change', (task, start, end) => {
        this.$emit('date-change', { task, start, end });
      });
      this.gantt.bind('progress_change', (task, progress) => {
        this.$emit('progress-change', { task, progress });
      });
      this.gantt.bind('view_change', (mode) => {
        this.$emit('view-change', mode);
      });
    },
    changeViewMode(mode) {
      if (this.gantt) {
        this.gantt.change_view_mode(mode);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~frappe-gantt/dist/frappe-gantt.css";
</style>