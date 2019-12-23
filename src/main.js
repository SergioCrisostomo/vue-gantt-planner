import Vue from "vue";
import App from "./VueGanttPlanner.vue";

// mock data
import mockData from "./assets/mockData";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App, {props: { ...mockData }}),

}).$mount("#app");
