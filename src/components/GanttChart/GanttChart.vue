<template>
  <div>
    <div
      class="compact-filter-panel p-d-flex p-ai-center p-p-2 p-mb-3 p-shadow-1"
    >
      <!-- Статус -->
      <Dropdown
        v-model="filters.statusId"
        :options="statusOptions"
        optionLabel="name"
        optionValue="id"
        placeholder="Статус"
        showClear
        class="p-inputtext-sm p-mr-2"
        style="min-width: 120px"
        @change="applyFilters"
      />

      <!-- Приоритет -->
      <Dropdown
        v-model="filters.priorityId"
        :options="priorityOptions"
        optionLabel="name"
        optionValue="id"
        placeholder="Приоритет"
        showClear
        class="p-inputtext-sm p-mr-2"
        style="min-width: 120px"
        @change="applyFilters"
      />

      <Dropdown
      v-model="filters.userId"
      :options="this.teamUsers"
      optionLabel="login"
      optionValue="id"
      placeholder="Выберите исполнителя"
      :filter="true"
      filterPlaceholder="Поиск пользователей"
      :showClear="true"
      style="min-width: 120px"
      @change="applyFilters"
    ></Dropdown>

      <!-- Период (два DatePicker) -->
      <div class="p-d-flex p-ai-center p-mr-2">
        <Calendar
          v-model="filters.dateFrom"
          placeholder="Дата от"
          dateFormat="dd.mm.yy"
          showIcon
          class="p-inputtext-sm"
          style="width: 120px"
          @date-select="applyFilters"
        />
        <span class="p-mx-1">—</span>
        <Calendar
          v-model="filters.dateTo"
          placeholder="Дата до"
          dateFormat="dd.mm.yy"
          showIcon
          class="p-inputtext-sm"
          style="width: 120px"
          @date-select="applyFilters"
        />
      </div>

      <!-- Кнопка сброса -->
      <Button
        icon="pi pi-times"
        label="Сбросить"
        class="p-button-sm p-button-text p-button-danger"
        @click="resetFilters"
      />
    </div>

    <div class="view-mode-panel p-d-flex p-ai-center p-p-2 p-mb-3 p-shadow-1">
      <span class="p-mr-2">Режим просмотра:</span>
      <Button
        icon="pi pi-calendar"
        label="День"
        class="p-button-sm"
        :class="{ 'p-button-primary': viewMode === 'Day' }"
        @click="viewMode = 'Day'"
      />
      <Button
        icon="pi pi-calendar"
        label="Неделя"
        class="p-button-sm p-mx-1"
        :class="{ 'p-button-primary': viewMode === 'Week' }"
        @click="viewMode = 'Week'"
      />
      <Button
        icon="pi pi-calendar"
        label="Месяц"
        class="p-button-sm"
        :class="{ 'p-button-primary': viewMode === 'Month' }"
        @click="viewMode = 'Month'"
      />
      <!-- <Button
        icon="pi pi-calendar"
        label="Год"
        class="p-button-sm p-ml-1"
        :class="{ 'p-button-primary': viewMode === 'Year' }"
        @click="viewMode = 'Year'"
      /> -->
    </div>

    <FrappeGantt
      v-if="filteredTasks.length > 0"
      :tasks="filteredTasks"
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
      viewMode: 'Month',
      rawTasks: [], // Храним исходные задачи
      taskDependencies: [],
      filters: {
        statusId: null,
        priorityId: null,
        userId: null,
        dateFrom: null,
        dateTo: null
      }
    };
  },
  computed: {
    filteredTasks() {
      return this.rawTasks
        .filter((task) => {
          if (!task || !task.begin_date || !task.end_date) return false;

          // Фильтрация по статусу
          if (
            this.filters.statusId &&
            task.status_id != this.filters.statusId
          ) {
            return false;
          }

          // Фильтрация по приоритету
          if (
            this.filters.priorityId &&
            task.priority_id != this.filters.priorityId
          ) {
            return false;
          }

          // Фильтрация по исполнителю
          if (
            this.filters.userId &&
            task.executor_id != this.filters.userId
          ) {
            return false;
          }

          // Фильтрация по датам
          const taskBegin = new Date(task.begin_date);
          const taskEnd = new Date(task.end_date);

          if (this.filters.dateFrom) {
            const fromDate = new Date(this.filters.dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (taskEnd < fromDate) return false;
          }

          if (this.filters.dateTo) {
            const toDate = new Date(this.filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (taskBegin > toDate) return false;
          }

          return true;
        })
        .map((task) => this.convertToGanttTask(task))
        .filter((task) => task !== null);
    }
  },
  props: {
    project_id: {
      type: Number,
      required: true
    },
    project_name: {
      type: String,
      required: true
    },
    statusOptions: {
      type: Array,
      default: () => []
    },
    priorityOptions: {
      type: Array,
      default: () => []
    },
    teamUsers: {
      type: Array,
      required: true,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
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
  methods: {
    applyFilters() {
      // Фильтрация происходит через computed свойство
    },
    resetFilters() {
      this.filters = {
        statusId: null,
        priorityId: null,
        userId: null,
        dateFrom: null,
        dateTo: null
      };
    },
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
        this.updateTasksWithDependencies();
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
          this.rawTasks = response.data.sort((a, b) => {
            return new Date(a.begin_date) - new Date(b.begin_date);
          });

          if (this.taskDependencies.length > 0) {
            this.updateTasksWithDependencies();
          }
        } else {
          this.rawTasks = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        this.rawTasks = [];
      }
    },
    buildTaskHierarchy(tasks) {
      // Создаем карту задач для быстрого доступа
      const taskMap = {};
      tasks.forEach((task) => {
        taskMap[task.id] = this.convertToGanttTask(task);
      });

      // Создаем карту зависимостей (какие задачи от кого зависят)
      const childMap = {};
      this.taskDependencies.forEach((dep) => {
        if (!childMap[dep.dependency_task_id]) {
          childMap[dep.dependency_task_id] = [];
        }
        childMap[dep.dependency_task_id].push(dep.main_task_id);
      });

      // Находим корневые задачи (те, у которых нет зависимостей)
      const rootTasks = tasks
        .filter((task) => {
          return !this.taskDependencies.some(
            (dep) => dep.main_task_id === task.id
          );
        })
        .map((task) => taskMap[task.id])
        .filter(Boolean);

      // Рекурсивно строим дерево задач
      const buildTree = (task) => {
        if (childMap[task.id]) {
          task.children = childMap[task.id]
            .map((childId) => taskMap[childId])
            .filter((child) => child)
            .sort((a, b) => new Date(a.start) - new Date(b.start));

          task.children.forEach(buildTree);
        }
        return task;
      };

      // Строим иерархию, начиная с корневых задач
      const hierarchicalTasks = rootTasks.map(buildTree);

      return hierarchicalTasks.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );
    },
    updateTasksWithDependencies() {
      const dependenciesMap = {};

      this.taskDependencies.forEach((dep) => {
        if (!dependenciesMap[dep.main_task_id]) {
          dependenciesMap[dep.main_task_id] = [];
        }
        dependenciesMap[dep.main_task_id].push(
          dep.dependency_task_id.toString()
        );
      });

      this.rawTasks = this.rawTasks.map((task) => {
        if (dependenciesMap[task.id]) {
          task.dependencies = dependenciesMap[task.id].join(',');
        }
        return task;
      });
    },
    convertToGanttTask(originalTask) {
      if (
        !originalTask?.id ||
        !originalTask.begin_date ||
        !originalTask.end_date
      ) {
        return null;
      }

      const startDate = this.formatDate(originalTask.begin_date);
      const endDate = this.formatDate(originalTask.end_date);

      if (!startDate || !endDate) return null;

      return {
        id: originalTask.id.toString(),
        name: originalTask.name || 'Без названия',
        start: startDate,
        end: endDate,
        progress: this.calculateProgress(originalTask.status_id),
        dependencies: originalTask.dependencies || '',
        custom_class: '',
        description: originalTask.description || ''
      };
    },
    formatDate(dateString) {
      if (!dateString) return null;
      try {
        return dateString.split('T')[0].split(' ')[0];
      } catch {
        return null;
      }
    },
    calculateProgress(statusId) {
      const statusMap = { 1: 0, 2: 50, 3: 100 };
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

.compact-filter-panel {
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.view-mode-panel {
  display: flex;
  align-items: center; /* Добавлено для вертикального выравнивания */
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  padding: 0.5rem; /* Исправлено с 0.5% на более предсказуемые rem */
  gap: 0.5rem; /* Исправлено с 1% на более предсказуемые rem */
}

.view-mode-panel span {
  display: flex; /* Добавлено */
  align-items: center; /* Центрирование по вертикали */
  height: 100%; /* Занимает всю высоту родителя */
  margin-right: 0.5rem; /* Лучше использовать margin-right вместо p-mr-2 для точного контроля */
}

.compact-filter-panel ::v-deep(.p-dropdown),
.compact-filter-panel ::v-deep(.p-calendar) {
  height: 32px;
}

.compact-filter-panel ::v-deep(.p-dropdown .p-dropdown-label),
.compact-filter-panel ::v-deep(.p-calendar .p-inputtext) {
  padding: 0.25rem 0.5rem;
}

.compact-filter-panel ::v-deep(.p-button) {
  width: auto;
  height: 32px;
  padding: 0 0.5rem;
}
</style>
