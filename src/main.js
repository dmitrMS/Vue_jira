import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import vueAxios from 'vue-axios';
import { store } from './store';

const app = createApp(App);

app.use(router);
app.use(vueAxios, axios);
app.use(store);
app.mount('#app');
