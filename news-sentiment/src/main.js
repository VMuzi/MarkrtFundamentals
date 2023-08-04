import { createApp } from 'vue'
import App from './App.vue'
import { createPinia, setActivePinia } from "pinia";
import config from '../config';


const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
setActivePinia(pinia);

app.config.globalProperties.$NewsURL = config.newsURL;
app.config.globalProperties.$ChatGptURL = config.ChatGtpURL;
app.config.globalProperties.$EverythingEndpoint = config.EverythingEndpoint;
app.config.globalProperties.$ApiKey = config.apiKey;
app.config.globalProperties.$AnalysisApiKey = config.AnalysisApiKey;
app.config.globalProperties.$TextAnalysisEndpoint = config.TextAnalysisEndpoint;
app.mount('#app');
