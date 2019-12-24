<template>
  <div
    :style="styles"
    class="gantt-project-container"
    @mousedown="onPointerDown"
  >
    <span>{{ id }}</span>
  </div>
</template>

<script>
export default {
  name: "project",
  props: ["id", "start", "end", "assignee", "markLength", "color"], // TODO: add types
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
      return `calc(${length} * 100% + ${pixelCorrection}px)`;
    },
    styles() {
      return {
        width: this.length,
        backgroundColor: this.color,
        left: this.x + "px",
        top: this.y + "px"
      };
    }
  },
  methods: {
    setDragPosition(x, y) {
      this.x = x - this.pointerDownOffset.x;
      this.y = y - this.pointerDownOffset.y;
    },
    onPointerDown(e) {
      this.pointerDownOffset = {
        x: e.clientX,
        y: e.clientY
      };
      this.setDragPosition(e.clientX, e.clientY);
      this.calculateDropCellPositions();

      window.addEventListener("mousemove", this.onPointerMove);
      window.addEventListener("mouseup", this.onPointerUp);
    },
    onPointerUp() {
      window.removeEventListener("mousemove", this.onPointerMove);
      window.removeEventListener("mouseup", this.onPointerUp);
    },
    onPointerMove(e) {
      this.setDragPosition(e.clientX, e.clientY);

      // calculate nearest cell
      const xy = ["x", "y"].map(type => {
        let pos = Math.min(...this.tablePositions[type]);
        for (let value of this.tablePositions[type]) {
          if (value < this[type]) pos = value;
        }
        return this.tablePositions[type].indexOf(pos);
      });
      const currentPosition = JSON.stringify(xy);
      if (currentPosition !== this.lastPosition) {
        this.lastPosition = currentPosition;
        this.$emit("reposition", ...xy);
      }
    },
    calculateDropCellPositions() {
      const startPosition = this.$el.getBoundingClientRect();
      const table = this.$el.closest("table");
      const xSteps = [...table.querySelector("tr").querySelectorAll("th")]
        .slice(1)
        .map(el => el.getBoundingClientRect().x - startPosition.x);

      const ySteps = [...table.querySelectorAll("tbody")].map(tr => {
        const th = tr.querySelector("th");
        return th.getBoundingClientRect().y - startPosition.y;
      });
      this.tablePositions = {
        x: xSteps,
        y: ySteps
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
}
.gantt-project-container span {
  margin-left: 5px;
}
</style>
