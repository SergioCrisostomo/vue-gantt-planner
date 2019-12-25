<template>
  <div :style="styles" class="gantt-project-container">
    <span>{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: "ProjectContainer",
  props: ["id", "name", "tasks", "markLength", "color", "start", "end"], // TODO: add types

  computed: {
    length() {
      const divider = this.markLength === "day" ? 864e5 : 864e5; // todo add month and week
      const length = (this.end.getTime() - this.start.getTime()) / divider;
      const pixelCorrection = length;
      return `calc(${length} * 100% + ${pixelCorrection}px)`;
    },
    styles() {
      return {
        width: this.length,
        backgroundColor: this.color
      };
    }
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
