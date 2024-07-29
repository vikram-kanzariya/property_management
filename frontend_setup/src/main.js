import { createApp } from "vue";
import App from "./App.vue";
import router from "./route";



import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import store from "./store";

const vuetify = new createVuetify({
  components,
  directives,
});

createApp(App)
.use(store)
.use(router)
.use(vuetify)
.mount("#app");
