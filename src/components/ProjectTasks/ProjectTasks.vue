<template>
  <div v-if="!openTrack" class="tasks">
    <div class="tasks-header">
      <h2>Задания проекта: {{ project_name }}</h2>
      <div class="tasks__header-controls">
        <input
          class="tasks__header-input"
          type="text"
          placeholder="Название задания"
          v-model="nameTask"
        />
        <button
          class="tasks__header-button"
          @click="createTask(this.nameTask, this.project_id)"
          :disabled="!nameTask"
        >
          Создать
        </button>
      </div>
    </div>

    <div
      class="compact-filter-panel p-d-flex p-ai-center p-p-2 p-mb-3 p-shadow-1"
    >
      <!-- Статус -->
      <Dropdown
        v-model="selectedStatusId"
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
        v-model="selectedPriorityId"
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
        v-model="selectedUser"
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
          v-model="dateRange[0]"
          placeholder="Дата от"
          dateFormat="dd.mm.yy"
          showIcon
          class="p-inputtext-sm"
          style="width: 120px"
          @date-select="applyFilters"
        />
        <span class="p-mx-1">—</span>
        <Calendar
          v-model="dateRange[1]"
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

    <!-- <div class="tasks__works"> -->
    <!-- <div v-for="item in filteredTasks" :key="item.id" class="user-row"> -->

    <div class="tasks__works">
      <div v-for="item in filteredTasks" :key="item" class="user-row">
        <div class="tasks__works__crudbody">
          Название:
          <input
            type="text"
            class="tasks__works__crudbody-input"
            placeholder="Название"
            v-model="item.name"
          />
          <!-- Колличество работ:<input
            type="text"
            class="tasks__works__crudbody-input"
            placeholder="работы"
            v-model="item.numTaskWorks"
          /> -->
          Общее время работ:<input
            type="text"
            class="tasks__works__crudbody-input"
            placeholder="работы"
            v-model="item.timeTaskWorks"
          />
          <div class="tasks__works__crudbody__buttongroup">
            <button class="update-btn" @click="selectTask(item)">
              Выбрать
            </button>
            <button class="track-btn" @click="sendTaskTrack(item)">
              Трэкинг
            </button>
            <button class="delete-btn" @click="deleteTask(item.id)">
              Удалить
            </button>
          </div>
        </div>
      </div>
      <TaskSidebar
        :tasks="this.projectTasks"
        :selected-task="selectedTask"
        @update="handleTaskUpdate"
        @close="selectedTask = null"
        @edit="handleTaskEdit"
        @delete="handleTaskDelete"
      />
    </div>
  </div>
  <trackPageComponent v-else @close="openTrack = false" @update="handleTaskWorksUpdate" />
</template>

<script>
import { toRaw } from 'vue';
import './ProjectTasks.css';

export default {
  data() {
    return {
      // teamName: localStorage.getItem('team_name'),
      visible: false,
      openTrack: false,
      // project_id: localStorage.getItem('team_id'),
      projectTasks: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role'),
      selectedTask: null,
      selectedStatus: null,
      selectedPriority: null,
      selectedUser: null,
      filteredTasks: [],
      // statusOptions: [],
      // priorityOptions: [],
      dateRange: [null, null],
      editableTask: { ...this.selectedTask }
    };
  },
  name: 'ProjectTasksPage',
  props: {
    project_id: {
      type: Number,
      required: true
    },
    project_name: {
      type: Number,
      required: true
    },
    statusOptions: {
      type: Array,
      required: true,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    priorityOptions: {
      type: Array,
      required: true,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
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
        }
      }
    }
  },
  // mounted() {
  //   this.installStatus();
  //   this.installPriority();
  // },
  methods: {
    applyFilters() {
      this.filteredTasks = this.projectTasks.filter((task) => {
        // Фильтрация по статусу
        if (this.selectedStatusId && task.status_id != this.selectedStatusId) {
          return false;
        }

        // Фильтрация по приоритету
        if (
          this.selectedPriorityId &&
          task.priority_id != this.selectedPriorityId
        ) {
          return false;
        }

        // Фильтрация по исполнителю
        if (this.selectedUser && task.executor_id != this.selectedUser) {
          return false;
        }

        // Фильтрация по датам
        const taskDateBegin = new Date(task.begin_date);
        const taskDateEnd = new Date(task.end_date);

        if (this.dateRange[0]) {
          const fromDate = new Date(this.dateRange[0]);
          fromDate.setHours(0, 0, 0, 0);
          if (taskDateBegin < fromDate) return false;
        }

        if (this.dateRange[1]) {
          const toDate = new Date(this.dateRange[1]);
          toDate.setHours(23, 59, 59, 999);
          if (taskDateEnd > toDate) return false;
        }

        return true;
      });
    },
    resetFilters() {
      this.selectedStatusId = null;
      this.selectedPriorityId = null;
      this.selectedUser = null;
      this.dateRange = [null, null];
      this.applyFilters();
    },

    // resetFilters() {
    //   this.selectedStatusId = null;
    //   this.selectedPriorityId = null;
    //   this.selectedPeriod = 'all';
    //   this.filteredTasks = [...this.projectTasks];
    // },
    handleTaskUpdate(updatedTask) {
      // Обновляем задачу в родительском компоненте
      // this.selectedTask = updatedTask;
      const index = this.filteredTasks.findIndex(
        (t) => t.id === updatedTask.id
      );
      if (index !== -1) {
        this.filteredTasks[index] = { ...updatedTask }; // реактивно заменяем
      }
      this.selectedTask = { ...updatedTask };
    },
    handleTaskWorksUpdate() {
      this.showTask();
    },
    closeSidebar() {
      this.selectedTask = null;
    },
    async selectTask(task) {
      this.selectedTask = task;
    },
    async sendTaskTrack(task) {
      this.openTrack = true;

      await this.$store.dispatch('updateTaskId', task);
    },
    async backTaskTrack() {
      this.openTrack = false;
    },
    async showTask() {
      // показание заданий команды
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.projectTasks = toRaw(
        await this.axios.get(
          process.env.VUE_APP_URL +
            `/project/tasks/list/${Number(this.project_id)}`,
          config
        )
      );

      this.projectTasks = this.projectTasks.data;

      this.filteredTasks = this.projectTasks;

      // Сортируем задачи по created_at в возрастающем порядке
      this.projectTasks = this.projectTasks.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA - dateB; // Для убывания поменяйте местами dateA и dateB
      });

      this.projectTasks = this.projectTasks.sort((a, b) => {
        const dateA = new Date(a.begin_date);
        const dateB = new Date(b.begin_date);
        return dateA - dateB; // Для убывания поменяйте местами dateA и dateB
      });

      let numTaskWorks;

      for (let element of this.projectTasks) {
        numTaskWorks = toRaw(
          await this.axios.get(
            process.env.VUE_APP_URL + `/task/track/list/${Number(element.id)}`,
            config
          )
        );

        element.timeTaskWorks = this.getTotalTimeForTask(numTaskWorks.data);
        // console.log(numTaskWorks.data);

        element.numTaskWorks = numTaskWorks.data.length;
      }
    },
    getTotalTimeForTask(works) {
      let totalMilliseconds = works.reduce((sum, work) => {
        const begin = new Date(work.begin_date);
        const end = new Date(work.end_date);
        return sum + (end - begin);
      }, 0);

      // переводим в часы (с округлением до двух знаков)
      let totalHours = totalMilliseconds / (1000 * 60 * 60);
      return totalHours.toFixed(2);
    },
    async deleteTask(task_id) {
      // удаление задания
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.delete(
        process.env.VUE_APP_URL + `/task/delete/${task_id}`,
        config
      );

      this.showTask();
    },
    async createTask(name, project_id) {
      // создание задания
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      // console.log(this.project_id);
      await this.axios.post(
        process.env.VUE_APP_URL + '/task/create',
        { name: name, project_id: project_id },
        config
      );

      this.visible = true;
      this.showTask();
    }
  }
};
</script>
