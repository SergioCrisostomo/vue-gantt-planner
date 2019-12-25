<template>
  <div class="gantt-plan">
    <tasks-overview
      :tasks-per-person="tasksPerPerson"
      :timeMarks="timeMarks"
      :staffLabel="staffLabel"
    ></tasks-overview>
    <project-overview
      :projects="projects"
      :timeMarks="timeMarks"
      :range-unit="rangeUnit"
    ></project-overview>
  </div>
</template>

<script>
import ProjectOverview from "./components/ProjectOverview";
import TasksOverview from "./components/TasksOverview.vue";

export default {
  name: "VueGanttPlanner",
  components: { ProjectOverview, TasksOverview },
  props: [
    "title",
    "startRange",
    "endRange",
    "rangeUnit",
    "staffLabel",
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
    tasksPerPerson() {
      return this.staff.map(staff => {
        const { name, id } = staff;
        let tasks = this.projects.reduce((tasks, proj) => {
          return [
            ...tasks,
            ...proj.tasks
              .filter(task => task.assignee === id)
              .map(task => {
                return {
                  ...task,
                  projectColor: proj.color
                };
              })
          ];
        }, []);
        if (tasks.length === 0) tasks = [null];
        return {
          name,
          id,
          tasks
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

<style>
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
  width: 60px;
}
.gantt-plan td {
  position: relative;
}
.gantt-plan tr th:first-child {
  padding: 0 2px;
  width: 100px;
}
</style>
