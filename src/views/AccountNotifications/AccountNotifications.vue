<template>
  <div class="notifications">
    <!-- <div id="components-demo">
      <auth-layout v-if="role == 'user'" />
      <admin-layout v-else />
    </div> -->
    <Menubar/>
    <h2>Уведомления</h2>
    <div class="notifications__group">
      <div v-for="item in notifications" :key="item" class="notifications__group__crudbody">
        <div class="crud-body">
          <p class="m-0">
            Приглашение в проект: {{ item.reason }}
          </p>
          <button
            @click="teamAgree(item.id,item.data_id)"
          >Принять</button>
          <button
            @click="deleteNotification(item.id)"
          >Отклонить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';
import './AccountNotifications.css';

export default {
  data() {
    return {
      teamName: '',
      nowWork: false,
      notifications: [],
      username: localStorage.getItem('login'),
      role: localStorage.getItem('role')
    };
  },
  name: 'AccountNotifications',
  methods: {
    async ShowNotifications() { // показ уведомлений о приглашении
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      this.notifications = toRaw(
        await this.axios.get(
          process.env.VUE_APP_URL + '/notification/list',
          // {},
          config
        )
      );

      this.notifications = this.notifications.data;
      console.log(this.notifications.data);
    },
    async deleteNotification(notification_id) { // отклонение приглашения в команду
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.delete(
        process.env.VUE_APP_URL + '/notification/delete'+`/${notification_id}`,
        // { },
        config
      );

      this.ShowNotifications();
    },
    async teamAgree(notification_id,project_id) { // принятие приглашения в команду
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.patch(
        process.env.VUE_APP_URL + '/notification/update',
        { notification_id:notification_id,project_id:project_id },
        config
      );

      this.ShowNotifications();
    }
  },
  mounted() {
    this.ShowNotifications();
  }
};
</script>
