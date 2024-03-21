import { createRouter, createWebHashHistory } from 'vue-router';
import signIn from '../views/SignIn.vue';
import signUp from '../views/SignUp.vue';
import trackPage from '../views/TrackPage.vue';
import accountTracking from '../views/AccountTracking.vue';
import reviewTracking from '../views/ReviewTracking.vue';

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
    path: '/track/account',
    name: 'accountTracking',
    component: accountTracking,
  },
  {
    path: '/track/review',
    name: 'reviewTracking',
    component: reviewTracking,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
