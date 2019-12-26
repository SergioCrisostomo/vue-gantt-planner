<template>
  <div
    :style="styles"
    class="gantt-project-container"
    @mousedown="onPointerDown"
  >
    <span>{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: "ProjectContainer",
  props: ["id", "name", "tasks", "markLength", "color", "start", "end"], // TODO: add types
  data() {
    return {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      pointerDownOffset: { x: 0, y: 0 },
      tablePositions: {}
    };
  },
  computed: {
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
  methods: {
    onPointerDown(e) {
      this.pointerDownOffset = {
        x: e.clientX,
        y: e.clientY
      };
      this.calculateCellPositions();
      window.addEventListener("mousemove", this.onPointerMove);
      window.addEventListener("mouseup", this.onPointerUp);
    },
    onPointerUp(e) {
      window.removeEventListener("mousemove", this.onPointerMove);
      window.removeEventListener("mouseup", this.onPointerUp);
      if (e instanceof Event && this.lastPosition) {
        const [col, row] = JSON.parse(this.lastPosition);
        this.$emit("reposition", { col, row, moveEnd: true });
      }
      this.lastPosition = "";
    },
    onPointerMove(e) {
      // NOTE: "y" is not used, maybe we can DRY it later
      const pointerCoords = {
        x: e.clientX - this.pointerDownOffset.x,
        y: e.clientY - this.pointerDownOffset.y
      };
      // calculate nearest cell
      const [col, row] = ["x", "y"].map(type => {
        let pos = Math.min(...this.tablePositions[type]);
        for (let value of this.tablePositions[type]) {
          if (value < pointerCoords[type]) pos = value;
        }
        return this.tablePositions[type].indexOf(pos);
      });
      const currentPosition = JSON.stringify([col, row]);
      if (currentPosition !== this.lastPosition) {
        this.lastPosition = currentPosition;
        this.$emit("reposition", { col, row, moveEnd: false });
      }
    },
    calculateCellPositions() {
      const startPosition = this.$el.getBoundingClientRect();
      const table = document.querySelector('table[data-type="projects"]');
      const xSteps = [...table.querySelector("tr").querySelectorAll("td")].map(
        el => el.getBoundingClientRect().x - startPosition.x
      );
      const ySteps = [...table.querySelectorAll("tr")].slice(1).map(tr => {
        const td = tr.querySelector("td");
        return td.getBoundingClientRect().y - startPosition.y;
      });
      this.tablePositions = {
        x: xSteps,
        y: ySteps
      };
    },
    setContainerPosition() {
      const rowSelector = `table[data-type="projects"] tr[data-project="${this.id}"]`;
      const row = document.querySelector(rowSelector);
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
.gantt-project-container {
  position: absolute;
  background-color: #ccf;
  height: 20px;
  border-radius: 3px;
  z-index: 1;
  user-select: none;
  transition: left 0.35s;
}
.gantt-project-container span {
  margin-left: 5px;
}
</style>
