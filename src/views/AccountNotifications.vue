<template>
  <div class="all-body">
    <div id="components-demo">
      <auth-layout v-if="role == 'user'" />
      <admin-layout v-else />
    </div>
    <div class="track-body">
    </div>
    <h2>Уведомления</h2>
    <div class="works">
      <Panel v-for="item in notifications" :key="item" style="height: 100px">
        <div class="crud-body">
          <p class="m-0">
            Приглашение в команду: {{ item.reason }}
          </p>
          <Button
            label="Принять"
            severity="danger"
            @click="teamAgree(item.id,item.data_id)"
          />
          <Button
            label="Отклонить"
            severity="danger"
            @click="deleteTeam(item.id)"
          />
        </div>
      </Panel>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';

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

      this.ShowWorkTime();
    },
    async teamAgree(notification_id,team_id) { // принятие приглашения в команду
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': localStorage.getItem('jwt')
        }
      };

      await this.axios.patch(
        process.env.VUE_APP_URL + '/notification/update',
        { notification_id:notification_id,team_id:team_id },
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
