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
    "projectColor",
    "staff",
    "staffTaskIndex"
  ], // TODO: add types
  data() {
    return {
      x: 2,
      y: 2,
      height: 0,
      width: 0,
      pointerDownOffset: { x: 0, y: 0 },
      tablePositions: [],
      lastPosition: ""
    };
  },
  computed: {
    styles() {
      return {
        width: this.width + "px",
        height: this.height + "px",
        backgroundColor: this.projectColor,
        left: this.x + 2 + "px",
        top: this.y + 2 + "px"
      };
    }
  },
  methods: {
    setContainerPosition() {
      const rowSelector = `table[data-type="tasks"] tr[data-staff="${this.staff.id}"]`;
      const row = document.querySelectorAll(rowSelector)[this.staffTaskIndex];

      const startTd = row.querySelector(
        `td[data-time-mark="${this.start.getTime()}"]`
      );
      const endTd = row.querySelector(
        `td[data-time-mark="${this.end.getTime()}"]`
      );

      const startCoords = startTd.getBoundingClientRect();
      const endCoords = endTd.getBoundingClientRect();
      this.x = startCoords.x;
      this.y = startCoords.y;
      this.height = startCoords.height - 3;
      this.width = endCoords.width + endCoords.x - startCoords.x - 3;
    }
  },
  watch: {
    start() {
      this.setContainerPosition();
    }
  },
  mounted() {
    this.setContainerPosition();
  }
};
</script>

<style>
.gantt-task-container {
  position: absolute;
  background-color: #ccf;
  height: 19px;
  border-radius: 3px;
  z-index: 1;
  user-select: none;
  transition: left 0.35s;
}
.gantt-task-container span {
  margin-left: 5px;
}
</style>
