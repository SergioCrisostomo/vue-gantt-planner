const oneDay = 864e5;
const today = new Date();
const tomorrow = new Date(today.getTime() + oneDay);
const yesterday = new Date(today.getTime() - oneDay);
const nextWeek = new Date(today.getTime() + oneDay * 7);

export default {
  staff: [
    { name: "Joakim", id: "001" },
    { name: "Erik", id: "002" },
    { name: "Gunnar", id: "003" },
    { name: "Manikandan", id: "004" },
    { name: "Sergio", id: "005" },
    { name: "Jordy", id: "006" },
    { name: "Piroska", id: "007" },
    { name: "Nadia", id: "008" },
    { name: "Jens", id: "009" },
    { name: "Souranshu", id: "010" }
  ],
  projects: [
    {
      id: "001",
      name: "Proj A",
      start: today,
      end: nextWeek,
      assignees: ["Joakim"],
      color: "#ccf"
    },
    {
      id: "002",
      name: "Proj B",
      start: yesterday,
      end: tomorrow,
      assignees: ["Sergio", "Jordy"],
      color: "#9dc"
    },
    {
      id: "003",
      name: "Proj C",
      start: yesterday,
      end: tomorrow,
      assignees: ["Gunnar", "Joakim"],
      color: "#88e"
    }
  ],
  title: "Vue Gantt Planner",
  startRange: yesterday,
  endRange: nextWeek,
  rangeUnit: "day",
  label: "Developer"
};
