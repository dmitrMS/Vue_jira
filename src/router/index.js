import { createRouter, createWebHashHistory } from 'vue-router';
import signIn from '../Pages/Sign/SignIn.vue';
import signUp from '../Pages/Sign/SignUp.vue';
import projects from '../Pages/Project/Project.vue';
import trackPage from '../Pages/TrackPage/TrackPage.vue';
import accountNotifications from '../Pages/AccountNotifications/AccountNotifications.vue';

// настройка маршрутизации
const routes = [
  {
    path: '/',
    name: 'signIn',
    component: signIn
  },
  {
    path: '/sign_up',
    name: 'signUp',
    component: signUp
  },
  {
    path: '/projects',
    name: 'projects',
    component: projects
  },
  {
    path: '/track',
    name: 'trackPage',
    component: trackPage
  },
  {
    path: '/notifications',
    name: 'accountNotifications',
    component: accountNotifications
  }
];

// создание маршрутов
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
