const oneDay = 864e5;
const today = new Date();
const tomorrow = new Date(today.getTime() + oneDay);
const yesterday = new Date(today.getTime() - oneDay);
const nextWeek = new Date(today.getTime() + oneDay * 7);

export default {
  staff: [
    "Joakim",
    "Erik",
    "Gunnar",
    "Manikandan",
    "Sergio",
    "Jordy",
    "Piroska",
    "Nadia",
    "Jens",
    "Souranshu"
  ],
  projects: [
    {
      id: "A",
      start: today,
      end: nextWeek,
      assignee: ["Joakim"],
      color: "#ccf"
    },
    {
      id: "B",
      start: yesterday,
      end: tomorrow,
      assignee: ["Sergio", "Jordy"],
      color: "#9dc"
    },
    {
      id: "C",
      start: yesterday,
      end: tomorrow,
      assignee: ["Gunnar", "Joakim"],
      color: "#88e"
    }
  ],
  title: "Vue Gantt Planner",
  startRange: yesterday,
  endRange: nextWeek,
  rangeUnit: "day",
  label: "Developer"
};
