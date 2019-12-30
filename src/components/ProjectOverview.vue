<template>
  <div>
    <h2>Project overview</h2>
    <div>
      <template v-for="project in projectsAndRanges">
        <project-container
          :key="project.data.id"
          v-bind="project.data"
          :start="project.start"
          :end="project.end"
          @reposition="onReposition(project, ...arguments)"
        ></project-container>
      </template>
    </div>
    <table data-type="projects">
      <tr
        v-for="project in projectsAndRanges"
        :key="project.data.id"
        :data-project="project.data.id"
      >
        <th>{{ project.data.name }}</th>
        <td
          v-for="mark in timeMarks.marks"
          :key="mark"
          :data-time-mark="mark"
        ></td>
      </tr>
    </table>
  </div>
</template>

<script>
import ProjectContainer from "./ProjectContainer";
import stringToDate from "../assets/stringToDate";
import dateToString from "../assets/dateToString";
export default {
  name: "ProjectOverview",
  components: { ProjectContainer },
  props: {
    projects: {
      type: Array
    },
    timeMarks: {
      type: Object
    },
    rangeUnit: {
      type: String,
      required: true
    }
  },
  computed: {
    projectsAndRanges() {
      return this.projects
        .map(proj => {
          const start = Math.min(
            ...proj.tasks.map(({ start }) => (start ? start.getTime() : 0))
          );
          if (!start) return null;
          const end = Math.max(...proj.tasks.map(({ end }) => end.getTime()));

          return {
            start: new Date(start),
            end: new Date(end),
            data: proj
          };
        })
        .filter(Boolean);
    }
  },
  methods: {
    onReposition(project, { col, moveEnd }) {
      const newStartDate = stringToDate(this.timeMarks.marks[col]);
      const oldStartDate = stringToDate(dateToString(project.start));
      const diff = newStartDate.getTime() - oldStartDate.getTime();
      this.$emit("project-reposition", {
        id: project.data.id,
        diff,
        moveEnd
      });
    }
  }
};
</script>

<style></style>
