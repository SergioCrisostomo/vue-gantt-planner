<template>
  <div :style="styles" class="gantt-project-container">
    <span>{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: "ProjectContainer",
  props: ["id", "name", "tasks", "markLength", "color", "start", "end"], // TODO: add types
  data() {
    return { x: 0, y: 0, height: 0, width: 0 };
  },
  computed: {
    length() {
      const divider = this.markLength === "day" ? 864e5 : 864e5; // todo add month and week
      const length = (this.end.getTime() - this.start.getTime()) / divider;
      const pixelCorrection = length;
      return `calc(${length} * 100% + ${pixelCorrection}px)`;
    },
    styles() {
      return {
        width: this.width + "px",
        height: this.height + "px",
        backgroundColor: this.color,
        left: this.x + 2 + "px",
        top: this.y + 2 + "px"
      };
    }
  },
  mounted() {
    const rowSelector = `tr[data-project="${this.id}"]`;
    const row = document.querySelector(rowSelector);
    // const table = row.closest('table');
    const startTd = row.querySelector(
      `td[data-time-mark="${this.start.getTime()}"]`
    );
    const endTd = row.querySelector(
      `td[data-time-mark="${this.end.getTime()}"]`
    );
    console.log(rowSelector, row, startTd, endTd);

    const startCoords = startTd.getBoundingClientRect();
    const endCoords = endTd.getBoundingClientRect();
    this.x = startCoords.x;
    this.y = startCoords.y;
    this.height = startCoords.height - 3;
    this.width = endCoords.width + endCoords.x - startCoords.x - 3;
  }
};
</script>

<style>
.gantt-project-container {
  position: absolute;
  background-color: #ccf;
  height: 20px;
  border-radius: 3px;
  z-index: 1;
  user-select: none;
  left: 2px;
  top: 1px;
}
.gantt-project-container span {
  margin-left: 5px;
}
</style>
