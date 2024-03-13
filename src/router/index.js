import { createRouter, createWebHashHistory } from 'vue-router';
import signIn from '../views/SignIn.vue';
import signUp from '../views/SignUp.vue';
import trackPage from '../views/TrackPage.vue';

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
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
