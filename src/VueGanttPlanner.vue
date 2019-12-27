<template>
  <div class="gantt-plan">
    <tasks-overview
      :tasks-per-person="tasksPerPerson"
      :timeMarks="timeMarks"
      :staffLabel="staffLabel"
      @task-reposition="onTaskReposition"
    ></tasks-overview>
    <project-overview
      :projects="projects"
      :timeMarks="timeMarks"
      :range-unit="rangeUnit"
      @project-reposition="onProjectReposition"
    ></project-overview>
    <engagement-overview
      :tasks-per-person="tasksPerPerson"
      :timeMarks="timeMarks"
      :staffLabel="staffLabel"
    ></engagement-overview>
  </div>
</template>

<script>
import ProjectOverview from "./components/ProjectOverview";
import TasksOverview from "./components/TasksOverview.vue";
import EngagementOverview from "./components/EngagementOverview.vue";

export default {
  name: "VueGanttPlanner",
  components: { EngagementOverview, ProjectOverview, TasksOverview },
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
                  projectColor: proj.color,
                  projectId: proj.id
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
          const end = this.endRange.getTime();
          const marks = [];
          while (start.getTime() < end) {
            marks.push(start.getTime());
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
    onProjectReposition(obj) {
      const updatedProjects = this.projects.map(project => {
        if (obj.id !== project.id) return project;
        return {
          ...project,
          tasks: project.tasks.map(task => {
            return {
              ...task,
              start: new Date(task.start.getTime() + obj.diff),
              end: new Date(task.end.getTime() + obj.diff)
            };
          })
        };
      });
      this.$emit("reposition", "project", updatedProjects);
    },
    onTaskReposition(obj) {
      // { projectId, taskId, diff, staffId, moveEnd }
      const updatedProjects = this.projects.map(project => {
        if (obj.projectId !== project.id) return project;

        return {
          ...project,
          tasks: project.tasks.map(task => {
            if (task.id !== obj.taskId) return task;

            console.log(this.staff.find(({ id }) => id === obj.staffId));
            return {
              ...task,
              assignee: obj.staffId,
              start: new Date(task.start.getTime() + obj.diff),
              end: new Date(task.end.getTime() + obj.diff)
            };
          })
        };
      });
      this.$emit("reposition", "task", updatedProjects);
    }
  }
};
</script>

<style>
.gantt-plan table {
  border-collapse: collapse;
  border: 1px solid black;
  table-layout: fixed;
}
.gantt-plan td.is-drag-target {
  background-color: #b2c9ee;
}
.gantt-plan th,
.gantt-plan td {
  border: 1px solid black;
  height: 22px;
  width: 60px;
  padding: 0;
  max-width: 60px;
}
.gantt-plan td {
  position: relative;
}
.gantt-plan tr th:first-child {
  padding: 0 2px;
  width: 100px;
}
</style>
