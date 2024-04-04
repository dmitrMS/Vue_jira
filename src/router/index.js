import { createRouter, createWebHashHistory } from 'vue-router';
import signIn from '../views/SignIn.vue';
import signUp from '../views/SignUp.vue';
import trackPage from '../views/TrackPage.vue';
import trackPageNoAuth from '../views/TrackPageNoAuth.vue';
import accountTracking from '../views/AccountTracking.vue';
import accountTrackingTeam from '../views/AccountTrackingTeam.vue';
import reviewTracking from '../views/ReviewTracking.vue';
import teamUpdate from '../views/TeamUpdate.vue';
import teamUsers from '../views/TeamUsers.vue';
import teamTasks from '../views/TeamTasks.vue';
import accountNotifications from '../views/AccountNotifications.vue';

const routes = [
  {
    path: '/',
    name: 'signIn',
    component: signIn,
  },
  {
    path: '/sign_up',
    name: 'signUp',
    component: signUp
  },
  {
    path: '/track',
    name: 'trackPage',
    component: trackPage,
  },
  {
    path: '/guest/track',
    name: 'trackPageNoAuth',
    component: trackPageNoAuth,
  },
  {
    path: '/track/account',
    name: 'accountTracking',
    component: accountTracking,
  },
  {
    path: '/track/review',
    name: 'reviewTracking',
    component: reviewTracking,
  },
  {
    path: '/track/team',
    name: 'accountTrackingTeam',
    component: accountTrackingTeam,
  },
  {
    path: '/team',
    name: 'teamUpdate',
    component: teamUpdate,
  },
  {
    path: '/user_team',
    name: 'teamUsers',
    component: teamUsers,
  },
  {
    path: '/notifications',
    name: 'accountNotifications',
    component: accountNotifications,
  },
  {
    path: '/team/tasks',
    name: 'teamTasks',
    component: teamTasks,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
