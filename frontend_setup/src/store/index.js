import users from "./modules/users";
import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

import Vue from "vue";

// Vue.config.devtools = true;
Vue
const store = new createStore({
  modules: {
    namespaced: true,
    users,
  },
  // plugins: [vuexLocal.plugin],
});

export default store;
