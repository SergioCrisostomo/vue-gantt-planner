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
          ref="tableRows"
          v-for="(project, rowIndex) in person.projects"
          :key="person.name + '_' + rowIndex"
        >
          <th :rowspan="person.projects.length" v-if="rowIndex === 0">
            {{ person.name }}
          </th>
          <td v-for="mark in timeMarks.marks" :key="mark.getTime()">
            <project-container
              :key="project.id + '_' + person.name"
              v-if="project && project.start.getTime() === mark.getTime()"
              v-bind="project"
              :mark-length="rangeUnit"
              @reposition="
                onRepositionEvent(project.id, person.id, ...arguments)
              "
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
      dragTarget: {}
    };
  },
  computed: {
    projectsPerPerson() {
      return this.staff.map(staff => {
        const { name, id } = staff;
        let projects = this.projects.filter(({ assignees }) =>
          assignees.find((assignee) => assignee.id === id)
        );
        if (projects.length === 0) projects = [null];
        return {
          name,
          id,
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
    onRepositionEvent(projectId, staffId, final, col, row) {
      this.dragTarget = { col, row };
      let newStaffId = (() => {
        let counter = 0;
        for (let person of this.projectsPerPerson) {
          for (let i = 0; i < person.projects.length; i++) {
            if (counter === row) {
              return person.id;
            } else {
              counter++;
            }
          }
        }
      })();
      this.$emit("reposition-event", {
        id: projectId,
        newStaffId,
        currentStaffId: staffId,
        startMark: this.timeMarks.marks[col],
        final
      });

      // toggle classes
      this.$refs.tableRows.forEach((tr, r) => {
        const tds = [...tr.querySelectorAll("td")];
        tds.forEach((td, c) => {
          const isSelectedCell = col === c && row === r;
          td.classList.toggle("is-drag-target", isSelectedCell);
        });
      });
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
.gantt-plan td.is-drag-target {
  background-color: #b2c9ee;
}
.gantt-plan th,
.gantt-plan td {
  border: 1px solid black;
  height: 22px;
}
.gantt-plan td {
  min-width: 60px;
  position: relative;
}
.gantt-plan tr th:first-child {
  padding: 0 2px;
}
</style>
