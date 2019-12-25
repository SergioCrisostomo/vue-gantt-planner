<template>
  <div :style="styles" class="gantt-task-container">
    <span>{{ type }}</span>
  </div>
</template>

<script>
export default {
  name: "TaskContainer",
  props: [
    "id",
    "type",
    "start",
    "end",
    "assignees",
    "markLength",
    "projectColor"
  ], // TODO: add types
  data() {
    return {
      x: 2,
      y: 2,
      pointerDownOffset: { x: 0, y: 0 },
      tablePositions: [],
      lastPosition: ""
    };
  },
  computed: {
    length() {
      const divider = this.markLength === "day" ? 864e5 : 864e5; // todo add month and week
      const length = (this.end.getTime() - this.start.getTime()) / divider;
      const pixelCorrection = length - 5;
      return length * 60 + pixelCorrection + "px";
    },
    styles() {
      return {
        width: this.length,
        backgroundColor: this.projectColor,
        left: this.x + "px",
        top: this.y + "px"
      };
    }
  }
};
</script>

<style>
.gantt-task-container {
  position: absolute;
  background-color: #ccf;
  height: 20px;
  border-radius: 3px;
  z-index: 1;
  user-select: none;
}
.gantt-task-container span {
  margin-left: 5px;
}
</style>
