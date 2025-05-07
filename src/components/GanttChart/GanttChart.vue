<template>
  <div>
    <FrappeGantt
      v-if="validTasks.length > 0"
      :tasks="validTasks"
      :view-mode="viewMode"
      @task-updated="handleTaskUpdate"
    />
    <div v-else class="empty-message">Нет задач для отображения</div>
  </div>
</template>

<script>
import { toRaw } from 'vue';

export default {
  name: 'GanttChart',
  data() {
    return {
      projectTasks: [],
      taskDependencies: []
    };
  },
  computed: {
    validTasks() {
      return this.projectTasks.filter(
        (task) => task !== null && task.start && task.end
      );
    }
  },
  props: {
    viewMode: {
      type: String,
      default: 'Month'
    },
    project_id: {
      type: Number,
      required: true
    },
    project_name: {
      type: String,
      required: true
    }
  },
  watch: {
    project_id: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.showTask(newId);
          this.showDependencies(newId);
        }
      }
    }
  },
  mounted() {
    if (this.project_id) {
      this.showTask();
      this.showDependencies();
    }
  },
  methods: {
    async showDependencies() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      try {
        const response = await this.axios.get(
          `${process.env.VUE_APP_URL}/dependency/list/${this.project_id}`,
          config
        );
        
        this.taskDependencies = toRaw(response.data) || [];
        
        // После загрузки зависимостей обновляем задачи
        if (this.projectTasks.length > 0) {
          this.updateTasksWithDependencies();
        }
      } catch (error) {
        console.error('Ошибка при загрузке зависимостей:', error);
        this.taskDependencies = [];
      }
    },

    async showTask() {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-key': localStorage.getItem('jwt')
          }
        };

        const response = await this.axios.get(
          `${process.env.VUE_APP_URL}/project/tasks/list/${this.project_id}`,
          config
        );

        if (response.data && Array.isArray(response.data)) {
          this.projectTasks = response.data.sort((a, b) => {
            const dateA = new Date(a.begin_date);
            const dateB = new Date(b.begin_date);
            return dateA - dateB;
          });

          this.projectTasks = this.projectTasks
            .map((task) => this.convertToGanttTask(task))
            .filter((task) => task !== null);

          // Если зависимости уже загружены, обновляем задачи
          if (this.taskDependencies.length > 0) {
            this.updateTasksWithDependencies();
          }
        } else {
          this.projectTasks = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        this.projectTasks = [];
      }
    },

    updateTasksWithDependencies() {
      // Создаем карту зависимостей: { mainTaskId: [dependencyTaskId1, dependencyTaskId2, ...] }
      const dependenciesMap = {};
      
      this.taskDependencies.forEach(dep => {
        if (!dependenciesMap[dep.main_task_id]) {
          dependenciesMap[dep.main_task_id] = [];
        }
        dependenciesMap[dep.main_task_id].push(dep.dependency_task_id.toString());
      });

      // Обновляем задачи с зависимостями
      this.projectTasks = this.projectTasks.map(task => {
        if (dependenciesMap[task.id]) {
          return {
            ...task,
            dependencies: dependenciesMap[task.id].join(',')
          };
        }
        return task;
      });
    },

    convertToGanttTask(originalTask) {
      if (
        !originalTask ||
        !originalTask.id ||
        !originalTask.begin_date ||
        !originalTask.end_date
      ) {
        console.warn('Некорректные данные задачи:', originalTask);
        return null;
      }

      const startDate = this.formatDate(originalTask.begin_date);
      const endDate = this.formatDate(originalTask.end_date);

      if (!startDate || !endDate) {
        console.warn('Некорректные даты задачи:', originalTask);
        return null;
      }

      return {
        id: originalTask.id.toString(),
        name: originalTask.name || 'Без названия',
        start: startDate,
        end: endDate,
        progress: this.calculateProgress(originalTask.status_id),
        dependencies: '', // Будет заполнено в updateTasksWithDependencies
        custom_class: '',
        description: originalTask.description || ''
      };
    },

    formatDate(dateString) {
      if (!dateString) return null;
      try {
        if (dateString.includes('T')) {
          return dateString.split('T')[0];
        }
        return dateString.split(' ')[0];
      } catch (e) {
        console.warn('Ошибка форматирования даты:', dateString);
        return null;
      }
    },

    calculateProgress(statusId) {
      const statusMap = {
        1: 0, // Не начато
        2: 50, // В работе
        3: 100 // Завершено
      };
      return statusMap[statusId] || 0;
    },

    handleTaskUpdate(task) {
      this.$emit('task-updated', task);
    }
  }
};
</script>

<style>
.empty-message {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>