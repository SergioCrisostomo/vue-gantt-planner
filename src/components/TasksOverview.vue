<template>
  <div>
    <div>
      <template v-for="person in tasksPerPerson">
        <template v-for="(task, i) in person.tasks"
          ><task-container
            v-if="task"
            :key="person.id + '_' + i"
            v-bind="task"
            :mark-length="rangeUnit"
          ></task-container
        ></template>
      </template>
    </div>
    <table>
      <thead>
        <tr>
          <th>{{ staffLabel }}</th>
          <th v-for="mark in timeMarks.marks" :key="mark.getTime()">
            {{ mark | formatDate }}
          </th>
        </tr>
      </thead>
      <tbody v-for="person in tasksPerPerson" :key="person.name">
        <tr
          v-for="(task, rowIndex) in person.tasks"
          :key="person.id + '_' + rowIndex"
          :index="rowIndex"
        >
          <th :rowspan="person.tasks.length" v-if="rowIndex === 0">
            {{ person.name }}
          </th>
          <td v-for="mark in timeMarks.marks" :key="mark.getTime()"></td>
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
  props: ["tasksPerPerson", "timeMarks", "staffLabel", "rangeUnit"], // TODO: add types and validators
  data() {
    return {
      dragTarget: {}
    };
  },
  computed: {},
  methods: {
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

<style></style>
