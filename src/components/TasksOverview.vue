<template>
  <div>
    <h2>Tasks overview</h2>
    <div>
      <template v-for="person in tasksPerPerson">
        <template v-for="(task, i) in person.tasks">
          <task-container
            v-if="task"
            :key="task.id"
            v-bind="task"
            :mark-length="rangeUnit"
            :staff="person"
            :staff-task-index="i"
            @reposition="onReposition(task, ...arguments)"
          ></task-container>
        </template>
      </template>
      <task-container
        v-for="(task, i) in unplannedTasks"
        :key="task.id"
        v-bind="task"
        :mark-length="rangeUnit"
        :staff="null"
        :staff-task-index="i"
        @reposition="onReposition(task, ...arguments)"
      ></task-container>
    </div>
    <table data-type="tasks">
      <thead>
        <tr>
          <th>{{ staffLabel }}</th>
          <th v-for="mark in timeMarks.marks" :key="mark">
            {{ mark | formatDate }}
          </th>
        </tr>
      </thead>
      <tbody v-for="person in tasksPerPerson" :key="person.name">
        <tr
          v-for="(task, rowIndex) in person.tasks"
          :key="person.id + '_' + rowIndex"
          :data-staff="person.id"
        >
          <th :rowspan="person.tasks.length" v-if="rowIndex === 0">
            {{ person.name }}
          </th>
          <td
            v-for="mark in timeMarks.marks"
            :key="mark"
            :data-time-mark="mark"
          ></td>
        </tr>
      </tbody>
    </table>
    <div>
      <h3>Unplanned tasks</h3>
      <div class="gantt-unplanned-tasks">
        <!-- unplanned tasks will be placed here... -->
      </div>
    </div>
  </div>
</template>

<script>
import TaskContainer from "./TaskContainer.vue";
import stringToDate from "../assets/stringToDate";
import dateToString from "../assets/dateToString";

export default {
  name: "TasksOverview",
  components: { TaskContainer },
  props: [
    "tasksPerPerson",
    "unplannedTasks",
    "timeMarks",
    "staffLabel",
    "rangeUnit"
  ], // TODO: add types and validators
  data() {
    return {
      dragTarget: {}
    };
  },
  computed: {},
  methods: {
    onReposition(task, { col, row, moveEnd }) {
      const [start, end] = [task.end, task.start]
        .map(dateToString)
        .map(stringToDate)
        .map(date => (date ? date.getTime() : 0));
      const timeDiff = Math.abs(end - start);
      const staff = (() => {
        let allRows = 0;
        for (let j = 0, persons = this.tasksPerPerson; j < persons.length;j++){
          for (let x = 0, tasks = persons[j].tasks; x < tasks.length; x++){
            if (allRows === row) return persons[j];
            allRows++;
          }
        }
      })();
      if (!staff) return;
      this.$emit("task-reposition", {
        projectId: task.project.id,
        taskId: task.id,
        start: stringToDate(this.timeMarks.marks[col]),
        end: new Date(
          stringToDate(this.timeMarks.marks[col]).getTime() + timeDiff
        ),
        staffId: staff.id,
        moveEnd
      });
    }
  },
  filters: {
    formatDate(str) {
      return str
        .slice(-5)
        .split("-")
        .reverse()
        .join("/");
    }
  }
};
</script>

<style>
.gantt-unplanned-tasks {
  position: relative;
  width: 100%;
  height: 20px;
  padding: 0.5rem;
}
</style>
