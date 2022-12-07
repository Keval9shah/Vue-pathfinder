import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from 'vue-toast-notification';
import "../public/vue-toast.css";
import "../public/bootstrap.css";

Vue.config.productionTip = false;

Vue.use(Toast,{position:"top-right", duration:4000});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
