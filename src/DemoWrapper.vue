<template>
  <vue-gantt-planner v-bind="mockData" @reposition-event="onReposition">
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
    onReposition({ id, newStaffId, currentStaffId, startMark, final }) {
      if (!final) return;
      const project = this.mockData.projects.find(obj => obj.id === id);

      let { assignees, start, end } = project;

      if (newStaffId !== currentStaffId) {
        // remove old assignee, add new assignee
        const newStaff = this.mockData.staff.find(
          ({ id }) => id === newStaffId
        );
        assignees = project.assignees
          .filter(id => id !== currentStaffId)
          .concat(newStaff.id);
      }
      if (startMark.getTime() !== start.getTime()) {
        const diff = end.getTime() - start.getTime();
        start = new Date(startMark.getTime());
        end = new Date(start.getTime() + diff);
      }

      const updatedProject = {
        ...project,
        assignees,
        start,
        end
      };

      this.mockData = {
        ...mockData,
        projects: this.mockData.projects.map(prj =>
          prj.id === id ? updatedProject : prj
        )
      };
    }
  }
};
</script>

<style scoped></style>
