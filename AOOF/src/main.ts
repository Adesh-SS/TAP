//Styles

import './assets/main.css'
import "primeflex/primeflex.css";
import "primevue/resources/themes/aura-light-green/theme.css";
import "primeicons/primeicons.css";

//App dependencies

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

//External Components

import PrimeVue from "primevue/config";
import AutoComplete from 'primevue/autocomplete';
import Chart from 'primevue/chart';
import Dialog from 'primevue/dialog';

//Internal Components

import AddUsers from './components/userDetails/addUsers.vue';
import GenReport from './components/userReport/genReport.vue';

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true  });

app.component('AutoComplete', AutoComplete);
app.component('Chart', Chart);
app.component('add-users', AddUsers);
app.component('gen-report', GenReport);
app.component('Dialog', Dialog);

app.mount('#app')
