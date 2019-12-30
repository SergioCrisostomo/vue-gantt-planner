<template>
  <div class="gantt-plan">
    <tasks-overview
      :tasks-per-person="tasksPerPerson"
      :timeMarks="timeMarks"
      :staffLabel="staffLabel"
      :unplanned-tasks="unplannedTasks"
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
import dateToString from "./assets/dateToString";

export default {
  name: "VueGanttPlanner",
  components: { EngagementOverview, ProjectOverview, TasksOverview },
  props: {
    title: {
      type: String,
      default: "Vue Gantt Planner"
    },
    startRange: {
      type: Date
    },
    endRange: {
      type: Date
    },
    rangeUnit: {
      type: String,
      validator: function(value) {
        return ["day", "week", "month"].indexOf(value) !== -1;
      }
    },
    staffLabel: {
      type: String,
      default: "Staff"
    },
    staff: {
      type: Array
    },
    projects: {
      type: Array
    }
  },
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
              .filter(task => task.assignee === id && task.start && task.end)
              .map(task => {
                return {
                  ...task,
                  project: proj
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
    unplannedTasks() {
      return this.projects.reduce((tasks, project) => {
        const unplannedTasks = project.tasks
          .filter(task => {
            return (
              [task.assignee, task.start, task.end].filter(Boolean).length === 0
            );
          })
          .map(task => {
            return {
              ...task,
              project
            };
          });
        if (unplannedTasks.length === 0) return tasks;
        return [...tasks, ...unplannedTasks];
      }, []);
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
            marks.push(dateToString(start));
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
      // { projectId, taskId, start, end, staffId, moveEnd }
      const updatedProjects = this.projects.map(project => {
        if (obj.projectId !== project.id) return project;

        return {
          ...project,
          tasks: project.tasks.map(task => {
            if (task.id !== obj.taskId) return task;

            return {
              ...task,
              assignee: obj.staffId,
              start: obj.start,
              end: obj.end
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
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}
.gantt-plan table thead th {
  color: #fff;
  background-color: #343a40;
  border-color: #454d55;
}
.gantt-plan td.is-drag-target {
  background-color: #b2c9ee;
}
.gantt-plan th,
.gantt-plan td {
  border: 1px solid black;
  height: 22px;
  width: 100px;
  max-width: 100px;
  padding: 0.5rem;
}
.gantt-plan td {
  position: relative;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}
.gantt-plan tr th:first-child {
  padding: 0 2px;
  width: 120px;
}
.gantt-task-container {
  display: table;
}
.gantt-task-container span {
  display: table-cell;
  vertical-align: middle;
  padding-left: 10px;
}
</style>
