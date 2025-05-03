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
            <input v-model="editedTask.priority" class="form-input" />
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
            <span class="info-value">{{
              selectedTask.priority || 'Не указан'
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

export default {
  name: 'TaskSidebar',
  props: {
    selectedTask: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isOpen: false,
      isEditing: false,
      editedTask: null,
      statusOptions: []
    };
  },
  watch: {
    selectedTask: {
      handler(newVal) {
        this.isOpen = !!newVal;
        if (newVal) {
          this.resetEditing();
          this.installStatus();
          // this.loadStatusOptions();
        }
      },
      deep: true
    }
  },
  methods: {
    async installStatus() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.statusOptions = await this.axios.get(
        process.env.VUE_APP_URL + `/status/list`,
        config
      );
      // console.log(this.statusOptions);

      this.statusOptions = this.statusOptions.data;
    },
    resetEditing() {
      this.editedTask = {
        ...this.selectedTask,
        // Форматируем даты для input[type="date"]
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
    startEditing() {
      this.isEditing = true;
    },
    cancelEditing() {
      this.resetEditing();
    },
    async saveChanges() {
      // this.$emit('update', { ...this.editedTask });

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      // Форматируем даты с учетом локального времени
      const formatForServer = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        // Добавляем временную часть и преобразуем в ISO строку
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
          begin_date: formatForServer(this.editedTask.begin_date_formatted),
          end_date: formatForServer(this.editedTask.end_date_formatted)
        },
        config
      );

      const updatedTask = {
      ...this.selectedTask,
      name: this.editedTask.name,
      description: this.editedTask.description,
      status_id: this.editedTask.status_id,
      begin_date: formatForServer(this.editedTask.begin_date_formatted),
      end_date: formatForServer(this.editedTask.end_date_formatted)
    };


      // Отправляем событие с обновленными данными
       this.$emit('update', updatedTask);

      this.isEditing = false;
    },
    async deleteTask() {
      if (confirm('Вы уверены, что хотите удалить это задание?')) {
        this.$emit('delete', this.selectedTask.id);
        this.closeSidebar();

        // удаление задания
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
      }

      // this.showTask();
    },
    closeSidebar() {
      this.isOpen = false;
      this.$emit('close');
    },
    getStatusText(status_id) {
      // return this.statusOptions[status]?.name || 'Неизвестный статус';
      const status = this.statusOptions.find((item) => item.id === status_id);
      return status ? status.name : 'Неизвестный статус';
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
    // deleteTask() {
    //   if (confirm('Вы уверены, что хотите удалить это задание?')) {
    //     this.$emit('delete', this.selectedTask.id);
    //     this.closeSidebar();
    //   }
    // }
  }
};
</script>
