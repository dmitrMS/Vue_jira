import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import vueAxios from 'vue-axios';
import { store } from './store';
import mainLayout from './Layout/Layout.vue';
import NoAuthLayout from './Layout/LayoutNoAuth.vue';
import FooterLayout from './Layout/LayoutFooter.vue';
import AdminLayout from './Layout/LayoutAdmin.vue';
import CalendarTime from './components/Calendar.vue';
import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import Password from 'primevue/password';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import 'primevue/resources/themes/aura-light-green/theme.css';

const app = createApp(App);

app.component('auth-layout', mainLayout);
app.component('no-auth-layout', NoAuthLayout);
app.component('footer-layout', FooterLayout);
app.component('admin-layout', AdminLayout);
app.component('calendar-time', CalendarTime);
app.component('Menubar', Menubar);
app.component('Password', Password);
app.component('Calendar', Calendar);
app.component('InputText', InputText);
app.component('Panel', Panel);
app.component('Button', Button);

app.use(PrimeVue);
app.use(router);
app.use(vueAxios, axios);
app.use(store);
app.mount('#app');
