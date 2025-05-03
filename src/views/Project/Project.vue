<template>
  <div class="project">
    <!-- Верхнее меню -->
    <Menubar class="menubar" />

    <!-- Основное окно проекта -->
    <div class="project__window">
      <!-- Кнопка сворачивания -->
      <button
        class="sidebar-toggle"
        @click="toggleSidebar()"
        :title="isSidebarCollapsed ? 'Развернуть' : 'Свернуть'"
      >
        {{ isSidebarCollapsed ? '›' : '‹' }}
      </button>
      <!-- Боковая панель с проектами -->
      <div
        class="project__sidebar"
        :class="{ 'project__sidebar--collapsed': isSidebarCollapsed }"
      >
        <!-- Блок создания нового проекта -->
        <div v-if="!isSidebarCollapsed" class="sidebar-content">
          <div class="project__parameters">
            <input
              class="project__parameters-input"
              type="text"
              placeholder="Назовите проект"
              v-model.trim="projectName"
              @keyup.enter="createProject(projectName)"
            />
            <button
              @click="createProject(projectName)"
              class="project__parameters-button"
              :disabled="!projectName"
            >
              Создать
            </button>
          </div>
        </div>
        <!-- Список проектов -->
        <div class="project__works">
          <div
            v-for="item in projects"
            :key="item.id"
            class="project__panel"
            :class="{ 'project__panel--active': item.id === selectedProjectId }"
          >
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
                  {{ item.id === selectedProjectId ? 'Выбран' : 'Выбрать' }}
                </button>
                <button
                  class="project__works__crudbody__buttongroup-button"
                  v-if="!item.task_id"
                  @click="updateProject(item)"
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

      <!-- Основное содержимое -->
      <div v-if="selectedProjectId" class="project__content">
        <TaskMenubar
          :project_id="selectedProjectId"
          :project_name="selectedProjectName"
        />
      </div>
      <h2 v-else class="project__placeholder">Создайте или выберите проект</h2>
    </div>
  </div>
</template>

<script>
import './Project.css';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'Projects',
  setup() {
    // Реактивные переменные
    const projectName = ref('');
    const projects = ref([]);
    const selectedProjectId = ref(null);
    const selectedProjectName = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const isSidebarCollapsed = ref(false);
    // const selectedTask = null;

    const toggleSidebar = async () => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
    };

    // Конфиг для запросов с авторизацией
    const getAuthConfig = () => ({
      headers: {
        'Content-Type': 'application/json',
        'x-auth-key': localStorage.getItem('jwt')
      }
    });

    // Загрузка проектов
    const showProjects = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_URL}/project/list`,
          getAuthConfig()
        );
        projects.value = response.data;
      } catch (err) {
        error.value = 'Не удалось загрузить проекты';
        console.error('Ошибка при загрузке проектов:', err);
      } finally {
        isLoading.value = false;
      }
    };

    // Создание проекта
    const createProject = async (name) => {
      if (!name.trim()) return;

      isLoading.value = true;
      try {
        await axios.post(
          `${process.env.VUE_APP_URL}/project/create`,
          { project_name: name },
          getAuthConfig()
        );
        await showProjects();
        projectName.value = '';
      } catch (err) {
        error.value = 'Не удалось создать проект';
        console.error('Ошибка при создании проекта:', err);
      } finally {
        isLoading.value = false;
      }
    };

    // Выбор проекта
    const selectProject = (id, name) => {
      selectedProjectId.value = id;
      selectedProjectName.value = name;
    };

    // Обновление проекта
    const updateProject = async (project) => {
      try {
        await axios.put(
          `${process.env.VUE_APP_URL}/project/update/${project.id}`,
          { name: project.name },
          getAuthConfig()
        );
        // Можно обновить локально без запроса к серверу
        const index = projects.value.findIndex((p) => p.id === project.id);
        if (index !== -1) {
          projects.value[index].name = project.name;
        }
      } catch (err) {
        error.value = 'Не удалось обновить проект';
        console.error('Ошибка при обновлении проекта:', err);
      }
    };

    // Удаление проекта
    const deleteProject = async (id) => {
      if (!confirm('Вы уверены, что хотите удалить проект?')) return;

      try {
        await axios.delete(
          `${process.env.VUE_APP_URL}/project/delete/${id}`,
          getAuthConfig()
        );
        // Сброс выбора, если удаляем текущий проект
        if (selectedProjectId.value === id) {
          selectedProjectId.value = null;
          selectedProjectName.value = null;
        }
        await showProjects();
      } catch (err) {
        error.value = 'Не удалось удалить проект';
        console.error('Ошибка при удалении проекта:', err);
      }
    };

    // Загрузка проектов при монтировании
    onMounted(showProjects);

    return {
      projectName,
      projects,
      selectedProjectId,
      selectedProjectName,
      isLoading,
      error,
      // selectedTask,
      isSidebarCollapsed,
      toggleSidebar,
      createProject,
      selectProject,
      updateProject,
      deleteProject
    };
  }
};
</script>
