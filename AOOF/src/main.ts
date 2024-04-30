import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from "primevue/config";
import AutoComplete from 'primevue/autocomplete';
import Chart from 'primevue/chart';

import App from './App.vue'
import router from './router'

import "primeflex/primeflex.css";
import "primevue/resources/themes/aura-light-green/theme.css";
import "primeicons/primeicons.css";

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true  });

app.component('AutoComplete', AutoComplete);
app.component('Chart', Chart);

app.mount('#app')
