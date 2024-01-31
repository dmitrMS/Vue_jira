import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// createApp(App).mount('#app')
// createApp .config.productionTip = false;

// new Vue({
//   history: "history",
//   router,
//   render: (h) => h(App),
// }).$mount("#app");

const app = createApp(App);
app.use(router);
app.mount("#app");
