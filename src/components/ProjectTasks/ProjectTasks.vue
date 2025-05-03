<template>
  <div v-if="!openTrack" class="tasks">
    <h2>Задания проекта: {{ project_name }}</h2>
    <div class="tasks__parameters">
      <input
        class="tasks__parameters-input"
        type="text"
        placeholder="Название задания"
        v-model="nameTask"
      />
      <button
        class="tasks__parameters-button"
        @click="createTask(this.nameTask, this.project_id)"
      >
        Создать
      </button>
    </div>
    <div class="tasks__works">
      <div v-for="item in projectTasks" :key="item">
        <div class="tasks__works__crudbody">
          Название:
          <input
            type="text"
            class="tasks__works__crudbody-input"
            placeholder="Название"
            v-model="item.name"
          />
          Колличество работ:<input
            type="text"
            class="tasks__works__crudbody-input"
            placeholder="работы"
            v-model="item.numTaskWorks"
          />
          <div class="track__works__crudbody__buttongroup">
            <button
              class="tasks__works__crudbody-button"
              @click="selectTask(item)"
            >
              Выбрать
            </button>
            <button
              class="tasks__works__crudbody-button"
              @click="sendTaskTrack(item)"
            >
              Трэкинг
            </button>
            <button
              class="tasks__works__crudbody-button"
              @click="deleteTask(item.id)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
      <TaskSidebar
        :selected-task="selectedTask"
        @update="handleTaskUpdate"
        @close="selectedTask = null"
        @edit="handleTaskEdit"
        @delete="handleTaskDelete"
      />
      <!-- <Dialog
        v-model:visible="visible"
        maximizable
        modal
        header="Сообщение"
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <p class="m-0">Приглашение отправлено пользователю</p>
      </Dialog> -->
    </div>
  </div>
  <trackPageComponent v-else @close="openTrack = false"/>
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
      selectedTask: null
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
  methods: {
    handleTaskUpdate(updatedTask) {
      // Обновляем задачу в родительском компоненте
      this.selectedTask = updatedTask;
      
      // // Если нужно обновить в общем списке задач:
      // const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      // if (index !== -1) {
      //   this.tasks.splice(index, 1, updatedTask);
      // }
    },
    closeSidebar() {
      this.selectedTask = null;
    },
    async selectTask(task) {
      this.selectedTask = task;
    },
    async sendTaskTrack(task) {
      this.openTrack=true;

      await this.$store.dispatch('updateTaskId', task);
    },
    async backTaskTrack() {
      this.openTrack=false;
    },
    async showTask() {
      // показание заданий команды
      console.log(this.project_id);
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

      let numTaskWorks;

      for (let element of this.projectTasks) {
        numTaskWorks = toRaw(
          await this.axios.get(
            process.env.VUE_APP_URL + `/task/track/list/${Number(element.id)}`,
            config
          )
        );

        element.numTaskWorks = numTaskWorks.data.length;
      }
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

      console.log(this.project_id);
      await this.axios.post(
        process.env.VUE_APP_URL + '/task/create',
        { name: name, project_id: project_id },
        config
      );

      this.visible = true;
      this.showTask();
    }
  }
  // mounted() {
  //   console.log(this.project_id);
  //   this.showTask();
  // }
};
</script>
