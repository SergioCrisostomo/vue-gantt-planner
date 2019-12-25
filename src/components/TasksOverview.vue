<template>
  <div>
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
            <task-container
              :key="project.id + '_' + person.name"
              v-if="checkPlacement(project, person.id, mark)"
              v-bind="project"
              :mark-length="rangeUnit"
            ></task-container>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TaskContainer from "./TaskContainer.vue";

export default {
  name: "TasksOverview",
  components: { TaskContainer },
  props: ["projectsPerPerson", "timeMarks", "label", "rangeUnit"], // TODO: add types and validators
  data() {
    return {
      dragTarget: {}
    };
  },
  computed: {},
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
    },
    checkPlacement(project, staffId, mark) {
      if (!project) return false;
      const staffInfo = project.assignees.find(staff => {
        return staff.id === staffId;
      });
      let comparator = staffInfo.start && staffInfo.end ? staffInfo : project;
      return comparator.start.getTime() === mark.getTime();
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

<style scoped></style>
