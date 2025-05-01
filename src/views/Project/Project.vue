<template>
  <div class="project">
    <Menubar class="menubar" />
    <div class="project__window">
      <div class="project__sidebar">
        <div class="project__parameters">
          <input
            class="project__parameters-input"
            type="text"
            placeholder="Назовите проект"
            v-model="projectName"
          />
          <button
            @click="createProject(projectName)"
            class="project__parameters-button"
          >
            Создать
          </button>
        </div>
        <div class="project__works">
          <div v-for="item in projects" :key="item.id" class="project__panel">
            <div class="project__works__crudbody">
              <input
                type="text"
                class="project__works__crudbody-input"
                placeholder="Название проекта"
                v-model="item.name"
              />
              <div class="project__works__crudbody__buttongroup">
                <button
                  class="project__works__crudbody__buttongroup-button"
                  @click="selectProject(item.id, item.name)"
                >
                  Выбрать
                </button>
                <button
                  class="project__works__crudbody__buttongroup-button"
                  v-if="item.task_id == null"
                  @click="
                    updateWorkTime(
                      item.id,
                      item.task_name,
                      item.begin_date,
                      item.end_date
                    )
                  "
                >
                  Изменить
                </button>
                <button
                  class="project__works__crudbody-button"
                  @click="deleteProject(item.id)"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedProjectId" style="width: 100%;">
        <TaskMenubar
        :project_id="selectedProjectId"
          :project_name="selectedProjectName"
        />
        <!-- <projectTasks
          :project_id="selectedProjectId"
          :project_name="selectedProjectName"
        /> -->
      </div>
      <h2 class="project__window-h2" v-else>Создайте или выберите проект</h2>
    </div>
  </div>
</template>

<script>
// import Menubar from '@/components/Menubar.vue';
import './Project.css';
import { toRaw } from 'vue';

export default {
  name: 'Projects',
  data() {
    return {
      selectedProject: '',
      selectedTask: 'Выберете задание',
      selectedTaskObj: {},
      projectName: '',
      date: null,
      projects: [],
      selectedProjectId: null,
      selectedProjectName: null,
      tasks: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role')
    };
  },
  methods: {
    async showProjects() {
      // показ рабочего времени пользователя в одиночку, при выборе команды- в этой команде
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.projects = toRaw(
        await this.axios.get(process.env.VUE_APP_URL + '/project/list', config)
      );

      this.projects = this.projects.data;
    },
    // async selectProject(project_id, project_name) {
    //   // переключение на раздел с информацией о команде
    //   await this.$store.dispatch('updateTeamId', {
    //     team_id: project_id,
    //     team_name: project_name
    //   });
    //   // this.$router.push('/user_team');
    // },
    async createProject(projectName) {
      // показ рабочего времени пользователя в одиночку, при выборе команды- в этой команде
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.projects = toRaw(
        await this.axios.post(
          process.env.VUE_APP_URL + '/project/create',
          { project_name: projectName },
          config
        )
      );

      this.projects = this.projects.data;
      this.showProjects();
    },
    selectProject(id, name) {
      this.selectedProjectId = id;
      this.selectedProjectName = name;
      // console.log(this.selectedProjectId);
    },
    // async selectProject(project_id) {
    //   // показ рабочего времени пользователя в одиночку, при выборе команды- в этой команде
    //   const config = {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'x-auth-key': localStorage.getItem('jwt')
    //     }
    //   };

    //   this.projects = toRaw(
    //     await this.axios.get(process.env.VUE_APP_URL + `/project/tasks/${project_id}:`, config)
    //   );

    //   this.projects = this.projects.data;
    //   this.showProjects();
    // },
    async deleteProject(id_project) {
      // удаление записи о рабочем времени
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.projects = toRaw(
        await this.axios.delete(
          process.env.VUE_APP_URL + '/project/delete' + `/${id_project}`,
          config
        )
      );

      this.showProjects();
    }
  },
  mounted() {
    this.showProjects();
  }
};
</script>
