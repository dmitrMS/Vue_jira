<template>
  <div class="all-body">
    <div id="components-demo">
      <auth-layout v-if="role == 'user'" />
      <admin-layout v-else />
      <team-layout />
    </div>
    <div class="track-body">
      <input type="text" placeholder="Название задания" v-model="nameTask" />
      <button @click="createTask(this.nameTask)">Создать</button>
    </div>
    <div class="works">
      <Panel v-for="item in teamTasks" :key="item" style="height: 100px">
        <div class="crud-body">
          <p class="m-0">
            Название:
            <InputText
              type="text"
              class="crud"
              placeholder="Название"
              v-model="item.name"
            />
            Команда:
            <InputText
              type="text"
              class="crud"
              placeholder="Команда"
              v-model="this.teamName"
            />
            Колличество работ:<InputText
              type="text"
              class="crud"
              placeholder="работы"
              v-model="item.numTaskWorks"
            />
          </p>
          <Button
            label="Удалить"
            severity="danger"
            @click="deleteTask(item.id)"
          />
        </div>
      </Panel>
      <Dialog
        v-model:visible="visible"
        maximizable
        modal
        header="Сообщение"
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <p class="m-0">Приглашение отправлено пользователю</p>
      </Dialog>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';

export default {
  data() {
    return {
      nameTask: '',
      teamName: localStorage.getItem('team_name'),
      nowWork: false,
      visible: false,
      teamId: localStorage.getItem('team_id'),
      teamTasks: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role')
    };
  },
  name: 'UserTeamPage',
  methods: {
    async showTask() {
      // показание заданий команды
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.teamTasks = toRaw(
        await this.axios.get(
          process.env.VUE_APP_URL + `/task/list/${Number(this.teamId)}`,
          config
        )
      );

      this.teamTasks = this.teamTasks.data;

      let numTaskWorks;

      for (let element of this.teamTasks) {
        numTaskWorks = toRaw(
          await this.axios.get(
            process.env.VUE_APP_URL + `/task/track/list/${Number(element.id)}`,
            // { task_id: Number(element.id) },
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
        process.env.VUE_APP_URL + '/task/delete'`/${task_id}`,
        { },
        config
      );

      this.showTask();
    },
    async createTask(name) {
      // создание задания
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.post(
        process.env.VUE_APP_URL + '/task/create',
        { name: name, team_id: Number(this.teamId) },
        config
      );

      this.visible = true;
      this.showTask();
    }
  },
  mounted() {
    this.showTask();
  }
};
</script>
