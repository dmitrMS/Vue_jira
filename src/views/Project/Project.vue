<template>
    <div class="track">
        <div id="components-demo">
          <auth-layout v-if="role == 'user'" />
          <admin-layout v-else />
        </div>
        <div class="track__works">
          <Panel v-for="item in works" :key="item" style="height: 100px">
            <div class="track__works__crudbody">
              <!-- <div class="track__works__crudbody-p"> -->
              Пользователь:
              <input
                type="text"
                class="track__works__crudbody-input"
                placeholder="Имя пользователя"
                v-model="this.username"
              />
              Задание:
              <input
                type="text"
                class="track__works__crudbody-input"
                placeholder="Задание"
                v-model="item.task_name"
              />
              Начало:<input
                type="text"
                class="track__works__crudbody-input"
                placeholder="дата начала"
                v-model="item.begin_date"
              />
              Конец:<input
                type="text"
                class="track__works__crudbody-input"
                placeholder="дата окончания"
                v-model="item.end_date"
              />
              <!-- </div> -->
              <div class="track__works__crudbody__buttongroup">
                <button
                  class="track__works__crudbody__buttongroup-button"
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
                  class="trackworks__crudbody-button"
                  @click="deleteWorkTime(item.id)"
                >
                  Удалить
                </button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
  </template>

  <script>
import './Project.css';

export default {
  name: 'Projects',
  data() {
    return {
      selectedProject: '',
      selectedTask: 'Выберете задание',
      selectedTaskObj: {},
      date: null,
      projects: [],
      tasks: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role')
    };
  },
  methods: {
  }
};
</script>