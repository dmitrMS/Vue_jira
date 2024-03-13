import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import vueAxios from 'vue-axios';
import { store } from './store';
import Antd from 'ant-design-vue';
import mainLayout from './Layout/Layout.vue';
import NoAuthLayout from './Layout/LayoutNoAuth.vue';

const app = createApp(App);

app.component('auth-layout',mainLayout);
app.component('no-auth-layout',NoAuthLayout);
app.use(router);
app.use(vueAxios, axios);
app.use(store);
app.use(Antd);
app.mount('#app');
