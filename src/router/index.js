import Vue from "vue";
import VueRouter from "vue-router";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import App from "../App.vue";
// Vue.use(VueRouter);
// const app = Vue.createApp({
//   router,
// });

// app.mount("#app");

const routes = [
  {
    path: "/",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/SignUp",
    name: "SignUp",
    component: SignUp,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});
// const router = createRouter({
//     history: createWebHistory(process.env.BASE_URL),
//     routes
//   })
// Vue(App).use(router).mount("#app");

export default router;
