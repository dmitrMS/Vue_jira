<template>
  <div>
    <!-- Затемнение фона (теперь вне основного сайдбара) -->
    <div class="sidebar-backdrop" v-if="isOpen" @click="closeSidebar"></div>

    <!-- Основной сайдбар -->
    <div class="task-sidebar" :class="{ 'task-sidebar--open': isOpen }">
      <div class="task-sidebar-header">
        <h3>Информация о задании</h3>
        <button class="close-button" @click="closeSidebar" title="Закрыть">
          &times;
        </button>
      </div>

      <div class="task-sidebar-content" v-if="selectedTask">
        <!-- Форма редактирования -->
        <div v-if="isEditing">
          <div class="form-group">
            <label>Название:</label>
            <input v-model="editedTask.name" class="form-input" />
          </div>

          <div class="form-group">
            <label>Статус:</label>
            <select v-model="editedTask.status_id" class="form-select">
              <option
                v-for="status in statusOptions"
                :value="status.id"
                :key="status.id"
              >
                {{ status.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Приоритет:</label>
            <select v-model="editedTask.priority_id" class="form-select">
              <option
                v-for="priority in priorityOptions"
                :value="priority.id"
                :key="priority.id"
              >
                {{ priority.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Исполнитель:</label>
            <select v-model="editedTask.executor_id" class="form-select">
              <option
                v-for="users in usersOptions"
                :value="users.id"
                :key="users.id"
              >
                {{ users.login }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Начало срока:</label>
            <input
              type="date"
              v-model="editedTask.begin_date_formatted"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Конец срока:</label>
            <input
              type="date"
              v-model="editedTask.end_date_formatted"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Родительские тикеты:</label>
            <div class="dependencies-list">
              <div
                v-for="(dep, index) in editingDependencies"
                :key="dep.id"
                class="dependency-item"
              >
                <Dropdown
                  v-model="dep.dependency_task_id"
                  :options="getAvailableTasksForDropdown(index)"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Выберите родительский тикет"
                  :filter="true"
                  filterPlaceholder="Поиск тикетов"
                  :showClear="true"
                  class="dependency-dropdown"
                  @change="onDependencyChange(index)"
                >
                  <template #option="slotProps">
                    <div class="task-option">
                      <span class="task-id">#{{ slotProps.option.id }}</span>
                      <span class="task-name">{{ slotProps.option.name }}</span>
                      <span
                        class="task-status"
                        :class="`status-${slotProps.option.status}`"
                      >
                        {{ getStatusText(slotProps.option.status_id) }}
                      </span>
                    </div>
                  </template>
                </Dropdown>
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-danger"
                  @click="removeEditingDependency(index)"
                  v-tooltip.top="'Удалить зависимость'"
                />
              </div>
              <Button
                icon="pi pi-plus"
                label="Добавить зависимость"
                class="p-button-text"
                @click="addEditingDependency"
                :disabled="!canAddMoreDependencies"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Описание:</label>
            <textarea
              v-model="editedTask.description"
              class="form-textarea"
            ></textarea>
          </div>

          <div class="edit-actions">
            <button class="action-button save" @click="saveChanges">
              Сохранить
            </button>
            <button class="action-button cancel" @click="cancelEditing">
              Отмена
            </button>
          </div>
        </div>

        <!-- Режим просмотра -->
        <div v-else class="task-info">
          <div class="info-row">
            <span class="info-label">Название:</span>
            <span class="info-value">{{ selectedTask.name }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Статус:</span>
            <span class="info-value" :class="`status--${selectedTask.status}`">
              {{ getStatusText(selectedTask.status_id) || 'Не указан' }}
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Приоритет:</span>
            <span class="info-value" :class="`status--${selectedTask.status}`">
              {{ getPriorityText(selectedTask.priority_id) || 'Не указан' }}
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Автор:</span>
            <span class="info-value">{{
              getUserText(selectedTask.author_id) || 'Не указан'
            }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Исполнитель:</span>
            <span class="info-value">{{
              getUserText(selectedTask.executor_id) || 'Не указан'
            }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Начало срока:</span>
            <span class="info-value">
              {{
                selectedTask.begin_date
                  ? formatDate(selectedTask.begin_date)
                  : 'Не установлен'
              }}
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Конец срока:</span>
            <span class="info-value">
              {{
                selectedTask.end_date
                  ? formatDate(selectedTask.end_date)
                  : 'Не установлен'
              }}
            </span>
          </div>

          <div class="info-row" v-if="parentTasks.length > 0">
            <span class="info-label">Родительские тикеты:</span>
            <div class="parent-tasks-list">
              <div
                v-for="task in parentTasks"
                :key="task.id"
                class="parent-task-item"
              >
                <span class="task-id">#{{ task.id }}</span>
                <span class="task-name">{{ task.name }}</span>
                <span class="task-status" :class="`status-${task.status}`">
                  {{ getStatusText(task.status_id) }}
                </span>
                <button
                  class="remove-dependency-btn"
                  @click.stop="removeParentTask(task.id)"
                  title="Удалить зависимость"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div class="info-row description">
            <span class="info-label">Описание:</span>
            <p class="info-value">
              {{ selectedTask.description || 'Нет описания' }}
            </p>
          </div>

          <div class="task-actions">
            <button class="action-button edit" @click="startEditing">
              Редактировать
            </button>
            <button class="action-button delete" @click="deleteTask">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './TaskSidebar.css';
import { toRaw } from 'vue';
import Button from 'primevue/button';
// import Dropdown from 'primevue/dropdown';
import Tooltip from 'primevue/tooltip';

export default {
  name: 'TaskSidebar',
  components: {
    Button
    // Dropdown
  },
  directives: {
    tooltip: Tooltip
  },
  props: {
    selectedTask: {
      type: Object,
      default: null
    },
    tasks: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      isOpen: false,
      isEditing: false,
      editedTask: null,
      usersOptions: [],
      statusOptions: [],
      priorityOptions: [],
      taskDependencies: [],
      editingDependencies: []
    };
  },
  computed: {
    parentTasks() {
      // Исправленное получение родительских задач
    // Получаем только родительские задачи для текущего выбранного задания
    return this.taskDependencies
      .filter(dep => dep.main_task_id === this.selectedTask.id) // Фильтруем по текущему заданию
      .map(dep => this.tasks.find(task => task.id === dep.dependency_task_id))
      .filter(task => task && task.id !== this.selectedTask?.id);
    },
    availableParentTasks() {
      return this.tasks.filter(
        (task) =>
          task.id !== this.selectedTask?.id &&
          !this.editingDependencies.some(
            (dep) =>
              dep.dependency_task_id === task.id &&
              dep.dependency_task_id !== null
          )
      );
    },
    canAddMoreDependencies() {
      return this.editingDependencies.length < 10; // Лимит зависимостей
    }
  },
  watch: {
    selectedTask: {
      async handler(newVal) {
        this.isOpen = !!newVal;
        if (newVal) {
          this.resetEditing();
          await this.installStatus();
          await this.installUsers();
          await this.installPriority();
          await this.showDependencies();
        }
      },
      deep: true
    }
  },
  methods: {
    // Ваши оригинальные методы
    async installStatus() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      const response = await this.axios.get(
        process.env.VUE_APP_URL + `/status/list`,
        config
      );
      this.statusOptions = response.data;
    },

    async installPriority() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      const response = await this.axios.get(
        process.env.VUE_APP_URL + `/priority/list`,
        config
      );
      this.priorityOptions = response.data;
    },

    async installUsers() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      const response = await this.axios.get(
        process.env.VUE_APP_URL +
          `/user_team/list/${Number(this.selectedTask.project_id)}`,
        config
      );
      this.usersOptions = toRaw(response.data);
    },

    async createDependency(main_id, dependency_id) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.post(
        process.env.VUE_APP_URL + '/dependency/create',
        { main_task_id: main_id, dependency_task_id: dependency_id },
        config
      );
    },

    async deleteDependency(dependency_id) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.delete(
        process.env.VUE_APP_URL + `/dependency/delete/${dependency_id}`,
        config
      );
    },

    async showDependencies() {
      // показание заданий команды
      console.log(this.project_id);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.taskDependencies = toRaw(
        await this.axios.get(
          process.env.VUE_APP_URL +
            `/dependency/list/${Number(this.selectedTask.project_id)}`,
          config
        )
      );

      this.taskDependencies = this.taskDependencies.data;
      this.taskDependencies = this.taskDependencies.filter(dep => dep.main_task_id === this.selectedTask.id);

      // // Сортируем задачи по created_at в возрастающем порядке
      // this.projectTasks = this.projectTasks.sort((a, b) => {
      //   const dateA = new Date(a.created_at);
      //   const dateB = new Date(b.created_at);
      //   return dateA - dateB; // Для убывания поменяйте местами dateA и dateB
      // });
    },

    cancelEditing() {
      this.isEditing = false;
    },

    addEditingDependency() {
      if (this.canAddMoreDependencies) {
        this.editingDependencies.push({
          id: Date.now(), // Временный ID для новых зависимостей
          main_task_id: this.selectedTask.id,
          dependency_task_id: null,
          isNew: true
        });
      }
    },

    removeEditingDependency(index) {
      this.editingDependencies.splice(index, 1);
    },

    getAvailableTasksForDropdown(currentIndex) {
      // Получаем все выбранные ID кроме текущего редактируемого
      const selectedIds = this.editingDependencies
        .filter((_, idx) => idx !== currentIndex)
        .map((dep) => dep.dependency_task_id)
        .filter(Boolean);

      return this.tasks.filter(
        (task) =>
          task.id !== this.selectedTask.id && // Исключаем текущую задачу
          !selectedIds.includes(task.id) // Исключаем уже выбранные в других зависимостях
      );
    },

    async removeParentTask(taskId) {
      if (!confirm('Удалить эту зависимость?')) return;

      try {
        // Находим зависимость, которую нужно удалить
        const dependencyToDelete = this.taskDependencies.find(
          (dep) =>
            dep.dependency_task_id === taskId &&
            dep.main_task_id === this.selectedTask.id
        );

        if (dependencyToDelete) {
          await this.deleteDependency(dependencyToDelete.id);
          await this.showDependencies(); // Обновляем список зависимостей
          this.$emit('update', this.selectedTask); // Оповещаем об изменении
        }
      } catch (error) {
        console.error('Ошибка при удалении зависимости:', error);
        alert('Не удалось удалить зависимость');
      }
    },

    onDependencyChange() {
      // При изменении выбора обновляем список доступных задач
      this.$forceUpdate(); // Принудительное обновление для пересчета доступных вариантов
    },

    async startEditing() {
      await this.showDependencies();
      this.editingDependencies = this.taskDependencies.map((dep) => ({
        ...dep,
        originalTask: this.tasks.find(
          (task) => task.id === dep.dependency_task_id
        )
      }));

      // Добавляем пустую зависимость, если их нет
      if (this.editingDependencies.length === 0) {
        this.addEditingDependency();
      }

      this.isEditing = true;
    },

    async saveChanges() {
      // try {
      // Сохраняем основные данные задачи
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      const formatForServer = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        ).toISOString();
      };

      await this.axios.patch(
        process.env.VUE_APP_URL + `/task/update`,
        {
          task_id: this.selectedTask.id,
          name: this.editedTask.name,
          description: this.editedTask.description,
          status_id: this.editedTask.status_id,
          priority_id: this.editedTask.priority_id,
          begin_date: formatForServer(this.editedTask.begin_date_formatted),
          end_date: formatForServer(this.editedTask.end_date_formatted),
          executor_id: this.editedTask.executor_id
        },
        config
      );

      // Обрабатываем зависимости
      const originalDeps = this.taskDependencies;
      const currentDeps = this.editingDependencies
      const originalIds = this.taskDependencies.map((dep) => dep.id);
      const currentIds = this.editingDependencies
        .filter((dep) => !dep.isNew)
        .map((dep) => dep.id);

      // Удаляем удаленные зависимости
      const dependenciesToDelete = originalIds.filter(
        (id) => !currentIds.includes(id)
      );
      for (const id of dependenciesToDelete) {
        await this.deleteDependency(id);
      }

      const depsToDelete = originalDeps.filter(origDep => 
          !currentDeps.some(d => d.id === origDep.id)
        );

        // Удаляем зависимости
        for (const dep of depsToDelete) {
          await this.deleteDependency(dep.id);
        }

      // Добавляем новые зависимости
      const dependenciesToAdd = this.editingDependencies.filter(
        (dep) => dep.isNew && dep.dependency_task_id
      );

      for (const dep of dependenciesToAdd) {
        await this.createDependency(
          this.selectedTask.id,
          dep.dependency_task_id
        );
      }

      // Обновляем список зависимостей
      await this.showDependencies();

      // Закрываем режим редактирования
      this.isEditing = false;

      // Отправляем событие обновления
      const updatedTask = {
        ...this.selectedTask,
        name: this.editedTask.name,
        description: this.editedTask.description,
        status_id: this.editedTask.status_id,
        priority_id: this.editedTask.priority_id,
        begin_date: formatForServer(this.editedTask.begin_date_formatted),
        end_date: formatForServer(this.editedTask.end_date_formatted),
        executor_id: this.editedTask.executor_id
      };

      this.$emit('update', updatedTask);

      // } catch (error) {
      //   console.error('Ошибка сохранения:', error);
      //   alert('Не удалось сохранить изменения');
      // }
    },

    // Остальные ваши методы
    resetEditing() {
      this.editedTask = {
        ...this.selectedTask,
        begin_date_formatted: this.formatDateForInput(
          this.selectedTask.begin_date
        ),
        end_date_formatted: this.formatDateForInput(this.selectedTask.end_date)
      };
      this.isEditing = false;
    },

    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

    async deleteTask() {
      if (confirm('Вы уверены, что хотите удалить это задание?')) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-key': localStorage.getItem('jwt')
          }
        };

        await this.axios.delete(
          process.env.VUE_APP_URL + `/task/delete/${this.selectedTask.id}`,
          config
        );

        this.$emit('delete', this.selectedTask.id);
        this.closeSidebar();
      }
    },

    closeSidebar() {
      this.isOpen = false;
      this.$emit('close');
    },

    getStatusText(status_id) {
      const status = this.statusOptions.find((item) => item.id === status_id);
      return status ? status.name : 'Не указан';
    },

    getPriorityText(priority_id) {
      const priority = this.priorityOptions.find(
        (item) => item.id === priority_id
      );
      return priority ? priority.name : 'Не указан';
    },

    getUserText(user_id) {
      const user = this.usersOptions.find((item) => item.id === user_id);
      return user ? user.login : 'Не указан';
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
  }
};
</script>

<style scoped>
.dependency-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.dependency-dropdown {
  flex-grow: 1;
}

.task-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-id {
  font-weight: bold;
  color: var(--primary-color);
}

.task-name {
  flex-grow: 1;
}

.task-status {
  font-size: 0.8rem;
  padding: 0.1rem 0.5rem;
  border-radius: 0.5rem;
  background: #e0e0e0;
}

.parent-tasks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.parent-task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.parent-task-item:hover {
  background: #e0e0e0;
}
</style>
