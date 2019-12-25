const oneDay = 864e5;
const today = new Date();
today.setHours(0);
const tomorrow = new Date(today.getTime() + oneDay);
const yesterday = new Date(today.getTime() - oneDay);
const nextWeek = new Date(today.getTime() + oneDay * 7);

const BACK_END = "BE";
const PM = "PM";
const FE = "FE";

export default {
  staff: [
    { name: "Joakim", id: "S001", roleTypes: [BACK_END, PM, FE] },
    { name: "Erik", id: "S002", roleTypes: [BACK_END, FE] },
    { name: "Gunnar", id: "S003", roleTypes: [BACK_END, FE] },
    { name: "Manikandan", id: "S004", roleTypes: [BACK_END, PM, FE] },
    { name: "Sergio", id: "S005", roleTypes: [FE, PM] },
    { name: "Jordy", id: "S006", roleTypes: [FE, PM] },
    { name: "Piroska", id: "S007", roleTypes: [FE, PM] },
    { name: "Nadia", id: "S008", roleTypes: [FE, PM] },
    { name: "Jens", id: "S009", roleTypes: [BACK_END, PM, FE] },
    { name: "Souranshu", id: "S010", roleTypes: [BACK_END, PM] }
  ],
  projects: [
    {
      id: "P001",
      name: "Proj A",
      tasks: [
        {
          id: "T001",
          assignee: "S001",
          type: PM,
          start: today,
          end: nextWeek,
          engagement: 50
        }
      ],
      color: "#ccf"
    },
    {
      id: "P002",
      name: "Proj B",
      tasks: [
        {
          id: "T002",
          assignee: "S005",
          type: PM,
          start: yesterday,
          end: tomorrow,
          engagement: 50
        },
        {
          id: "T003",
          assignee: "S004",
          type: BACK_END,
          start: today,
          end: tomorrow,
          engagement: 50
        }
      ],
      color: "#9dc"
    },
    {
      id: "P003",
      name: "Proj C",
      tasks: [
        {
          id: "T004",
          assignee: "S001",
          type: BACK_END,
          start: yesterday,
          end: tomorrow,
          engagement: 50
        },
        {
          id: "T005",
          assignee: "S008",
          type: FE,
          start: today,
          end: today,
          engagement: 50
        },
        {
          id: "T006",
          assignee: "S007",
          type: PM,
          start: yesterday,
          end: tomorrow,
          engagement: 50
        }
      ],
      color: "#88e"
    }
  ],
  title: "Vue Gantt Planner",
  startRange: new Date(yesterday.getTime() - oneDay),
  endRange: new Date(nextWeek.getTime() + oneDay),
  rangeUnit: "day",
  staffLabel: "Developer"
};
