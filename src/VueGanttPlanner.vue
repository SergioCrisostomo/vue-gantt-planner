<template>
  <div class="gantt-plan">
    <h2>{{ title }}</h2>
    <table>
      <thead>
        <tr>
          <th>{{ label }}</th>
          <th v-for="mark in timeMarks.marks" :key="mark.getTime()">
            {{ mark | formatDate }}
          </th>
        </tr>
      </thead>
      <tbody v-for="person in projectsPerPerson" :key="person.name">
        <tr
          v-for="(project, i) in person.projects"
          :key="person.name + '_' + i"
          @mouseenter="hoveredRow = { person, i }"
          :class="rowClasses(person, i)"
        >
          <th :rowspan="person.projects.length" v-if="i === 0">
            {{ person.name }}
          </th>
          <td v-for="mark in timeMarks.marks" :key="mark.getTime()">
            <project-container
              v-if="project && project.start.getTime() === mark.getTime()"
              :id="project.id"
              :start="project.start"
              :end="project.end"
              :assignee="project.assignee"
              :mark-length="rangeUnit"
              :color="project.color"
              @reposition="onRepositionEvent(project, ...arguments)"
            ></project-container>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ProjectContainer from "./components/ProjectContainer.vue";

export default {
  name: "VueGanttPlanner",
  components: { ProjectContainer },
  props: [
    "title",
    "startRange",
    "endRange",
    "rangeUnit",
    "label",
    "staff",
    "projects"
  ], // TODO: add types and validators
  data() {
    return {
      projectIssues: [],
      incrementType: "day",
      hoveredRow: {}
    };
  },
  computed: {
    projectsPerPerson() {
      return this.staff.map(name => {
        let projects = this.projects.filter(({ assignee }) =>
          assignee.includes(name)
        );
        if (projects.length === 0) projects = [null];
        return {
          name,
          projects
        };
      });
    },
    timeMarks() {
      const increment = this.incrementType;
      return {
        type: increment,
        marks: (() => {
          let start = this.startRange;
          const end = this.endRange;
          const marks = [];
          while (start < end) {
            marks.push(start);
            if (this.rangeUnit === "day") {
              start.setDate(start.getDate() + 1);
            }
            // TODO: adapt for months or weeks also
            start = new Date(start.getTime());
          }
          return marks;
        })()
      };
    }
  },
  methods: {
    rowClasses(person, i = null) {
      return {
        "is-drag-target":
          this.hoveredRow.person === person && this.hoveredRow.i === i
      };
    },
    onRepositionEvent(project, x, y) {
      console.log("onRepositionEvent", project, x, y);
    }
  },
  filters: {
    formatDate(date) {
      return [date.getDate(), date.getMonth() + 1]
        .map(nr => (nr > 9 ? nr : "0" + nr))
        .join("/");
    }
  }
};
</script>

<style scoped>
.gantt-plan table {
  border-collapse: collapse;
  border: 1px solid black;
}
.gantt-plan tr.is-drag-target {
  background-color: #b2c9ee;
}
.gantt-plan th,
.gantt-plan td {
  border: 1px solid black;
  height: 22px;
}
.gantt-plan td {
  min-width: 40px;
  position: relative;
}
.gantt-plan tr th:first-child {
  padding: 0 2px;
}
</style>
