import { createRouter, createWebHashHistory } from "vue-router";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import TrackPage from "../views/TrackPage";

const routes = [
  {
    path: "/",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/sign_up",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/track",
    name: "TrackPage",
    component: TrackPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
