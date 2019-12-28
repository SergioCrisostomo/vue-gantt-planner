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
        <task-container
          v-for="task in unplannedTasks"
          :key="task.id"
          v-bind="task"
          :mark-length="rangeUnit"
          :staff="null"
          :staff-task-index="0"
          @reposition="onReposition(task, ...arguments)"
        ></task-container>
      </div>
    </div>
  </div>
</template>

<script>
import TaskContainer from "./TaskContainer.vue";

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
      const [start, end] = [task.end, task.start].map(date =>
        date ? date.getTime() : 0
      );
      const timeDiff = Math.abs(end - start);
      const staff = this.tasksPerPerson[row];
      if (!staff) return;

      this.$emit("task-reposition", {
        projectId: task.project.id,
        taskId: task.id,
        start: this.timeMarks.marks[col],
        end: this.timeMarks.marks[col] + timeDiff,
        staffId: staff.id,
        moveEnd
      });
    }
  },
  filters: {
    formatDate(date) {
      if (typeof date === "number") date = new Date(date);
      return [date.getDate(), date.getMonth() + 1]
        .map(nr => (nr > 9 ? nr : "0" + nr))
        .join("/");
    }
  }
};
</script>

<style>
.gantt-unplanned-tasks .gantt-task-container {
  position: relative;
  width: 60px !important;
  height: 20px !important;
}
</style>
