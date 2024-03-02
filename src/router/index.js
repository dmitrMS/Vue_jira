import { createRouter, createWebHashHistory } from 'vue-router';
import signIn from '../views/signIn';
import signUp from '../views/signUp';
import trackPage from '../views/trackPage';

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
    path: '/track',
    name: 'trackPage',
    component: trackPage
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
