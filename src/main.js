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
import teamLayout from './Layout/LayoutTeam.vue';
import CalendarTime from './components/Calendar.vue';
import CalendarTimeTeam from './components/CalendarTeam.vue';
import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';
import Password from 'primevue/password';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import 'primevue/resources/themes/aura-light-green/theme.css';

const app = createApp(App);

app.component('auth-layout', mainLayout);
app.component('no-auth-layout', NoAuthLayout);
app.component('footer-layout', FooterLayout);
app.component('admin-layout', AdminLayout);
app.component('team-layout', teamLayout);
app.component('calendar-time', CalendarTime);
app.component('calendar-time-team', CalendarTimeTeam);
app.component('Menubar', Menubar);
app.component('Menu', Menu);
app.component('Password', Password);
app.component('Calendar', Calendar);
app.component('InputText', InputText);
app.component('Panel', Panel);
app.component('Button', Button);
app.component('Dropdown', Dropdown);

app.use(PrimeVue);
app.use(router);
app.use(vueAxios, axios);
app.use(store);

app.mount('#app');
