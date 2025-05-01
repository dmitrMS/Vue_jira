<template>
  <div>
    <Menubar class="menubar" />
    <ganttChart
      :tasks="tasks"
      :options="options"
      @task-click="handleTaskClick"
      @date-change="handleDateChange"
      @progress-change="handleProgressChange"
      @view-change="handleViewChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        {
          id: 'Task 1',
          name: 'Redesign website',
          start: '2023-04-01',
          end: '2023-04-05',
          progress: 20,
          dependencies: '',
          custom_class: 'bar-milestone'
        },
        {
          id: 'Task 2',
          name: 'Write new content',
          start: '2023-04-03',
          end: '2023-04-07',
          progress: 5,
          dependencies: 'Task 1',
          custom_class: 'bar-critical'
        }
      ],
      options: {
        view_mode: 'Week',
        on_click: (task) => {
          console.log('Task clicked:', task);
        }
      }
    };
  },
  methods: {
    handleTaskClick(task) {
      console.log('Task clicked from Vue event:', task);
    },
    handleDateChange({ task, start, end }) {
      console.log('Date changed:', task, start, end);
    },
    handleProgressChange({ task, progress }) {
      console.log('Progress changed:', task, progress);
    },
    handleViewChange(mode) {
      console.log('View mode changed:', mode);
    }
  }
};
</script>