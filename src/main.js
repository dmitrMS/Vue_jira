import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import vueAxios from 'vue-axios';
import { store } from './store';

import PrimeVue from 'primevue/config';
import Menubar from './Features/Menubar/Menubar.vue';
import TaskMenubar from './Features/TaskMenubar/TaskMenubar.vue';
import TaskSidebar from './Features/TaskSidebar/TaskSidebar.vue';
import ProjectTasks from './Features/ProjectTasks/ProjectTasks.vue';
import TrackPageComponent from './Features/TrackPageComponent/TrackPageComponent.vue';
import TeamProject from './Features/TeamProject/TeamProject.vue';
import FrappeGantt from './Features/GanttChart/FrappeGantt.vue';
import GanttChart from './Features/GanttChart/GanttChart.vue';
import DataTable from 'primevue/datatable';
import Calendar from 'primevue/calendar';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Dropdown from 'primevue/dropdown';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import 'primevue/resources/themes/saga-blue/theme.css'; // или другой theme
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App);

// поключение компонентов
app.component('Menubar', Menubar);
app.component('TaskMenubar', TaskMenubar);
app.component('TaskSidebar', TaskSidebar);
app.component('projectTasks', ProjectTasks);
app.component('trackPageComponent', TrackPageComponent);
app.component('teamProject', TeamProject);
app.component('ganttChart', GanttChart);
app.component('FrappeGantt', FrappeGantt);
app.component('Calendar', Calendar);
app.component('Password', Password);
app.component('InputText', InputText);
app.component('Panel', Panel);
app.component('Button', Button);
app.component('AutoComplete', AutoComplete);
app.component('Chip', Chip);
app.component('Dropdown', Dropdown);
app.component('DataTable', DataTable);

// подлючение библиотек для использования во всех vue компонентах без import
app.use(PrimeVue);
app.use(router);
app.use(vueAxios, axios);
app.use(store);

// мотирование приложения
app.mount('#app');
