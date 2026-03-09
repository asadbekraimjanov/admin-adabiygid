import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/main.css'
import store from '@/store/store.js'

const app = createApp(App)

const token = localStorage.getItem("token")

if (token) {
    store.commit("setToken", token)
}

app.use(router)
    .use(ElementPlus)
    .use(store)
    .mount('#app')
