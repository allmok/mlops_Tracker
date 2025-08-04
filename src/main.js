import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import PrimeVueChart from 'primevue/chart' 
import Button from 'primevue/button'
import Card from 'primevue/card' 
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

import { Chart as ChartJS } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(zoomPlugin);

const app = createApp(App)

app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'outlined'
})

app.component('Chart', PrimeVueChart)
app.component('Button', Button)
app.component('Card', Card)
app.component('Checkbox', Checkbox)
app.component('Message', Message)
app.component('ProgressSpinner', ProgressSpinner)

app.mount('#app')