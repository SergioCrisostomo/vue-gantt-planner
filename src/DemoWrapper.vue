<template>
  <vue-gantt-planner v-bind="mockData" @reposition="onReposition">
  </vue-gantt-planner>
</template>

<script>
import VueGanttPlanner from "./VueGanttPlanner.vue";
// mock data
import mockData from "./assets/mockData";

export default {
  name: "DemoWrapper",
  components: { VueGanttPlanner },
  data() {
    return { mockData };
  },
  methods: {
    onReposition(type, projects) {
      this.mockData = {
        ...this.mockData,
        projects: projects
      };
    }
  }
};
</script>

<style scoped></style>
