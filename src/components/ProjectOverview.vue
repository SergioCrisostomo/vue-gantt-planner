<template>
  <div>
    <h2>Project overview</h2>
    <table>
      <tr v-for="project in projectsAndRanges" :key="project.data.id">
        <th>{{ project.data.name }}</th>
        <td v-for="mark in timeMarks.marks" :key="mark">
          <project-container
            v-if="mark === project.start.getTime()"
            v-bind="project.data"
            :start="project.start"
            :end="project.end"
          ></project-container>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import ProjectContainer from "./ProjectContainer";
export default {
  name: "ProjectOverview",
  components: { ProjectContainer },
  props: ["projects", "timeMarks", "rangeUnit"],
  computed: {
    projectsAndRanges() {
      return this.projects.map(proj => {
        const start = Math.min(
          ...proj.tasks.map(({ start }) => start.getTime())
        );
        const end = Math.max(...proj.tasks.map(({ end }) => end.getTime()));

        return {
          start: new Date(start),
          end: new Date(end),
          data: proj
        };
      });
    }
  }
};
</script>

<style scoped></style>
