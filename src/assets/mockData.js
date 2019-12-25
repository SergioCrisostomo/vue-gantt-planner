const oneDay = 864e5;
const today = new Date();
const tomorrow = new Date(today.getTime() + oneDay);
const yesterday = new Date(today.getTime() - oneDay);
const nextWeek = new Date(today.getTime() + oneDay * 7);

const BACK_END = "BackEnd";
const PM = "Product Manager";
const FE = "FrontEnd";

export default {
  staff: [
    { name: "Joakim", id: "001", roleTypes: [BACK_END, PM, FE] },
    { name: "Erik", id: "002", roleTypes: [BACK_END, FE] },
    { name: "Gunnar", id: "003", roleTypes: [BACK_END, FE] },
    { name: "Manikandan", id: "004", roleTypes: [BACK_END, PM, FE] },
    { name: "Sergio", id: "005", roleTypes: [FE, PM] },
    { name: "Jordy", id: "006", roleTypes: [FE, PM] },
    { name: "Piroska", id: "007", roleTypes: [FE, PM] },
    { name: "Nadia", id: "008", roleTypes: [FE, PM] },
    { name: "Jens", id: "009", roleTypes: [BACK_END, PM, FE] },
    { name: "Souranshu", id: "010", roleTypes: [BACK_END, PM] }
  ],
  projects: [
    {
      id: "P001",
      name: "Proj A",
      tasks: [
        {
          id: "T001",
          assignee: "A001",
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
      start: yesterday,
      end: tomorrow,
      tasks: [
        {
          id: "T002",
          assignee: "A005",
          type: PM,
          start: yesterday,
          end: tomorrow,
          engagement: 50
        },
        {
          id: "T003",
          assignee: "A004",
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
      start: yesterday,
      end: tomorrow,
      tasks: [
        {
          id: "T004",
          assignee: "A001",
          type: BACK_END,
          start: yesterday,
          end: today,
          engagement: 50
        },
        {
          id: "T005",
          assignee: "A008",
          type: "FrontEnd",
          start: today,
          end: tomorrow,
          engagement: 50
        },
        {
          id: "T006",
          assignee: "A007",
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
  startRange: yesterday,
  endRange: nextWeek,
  rangeUnit: "day",
  label: "Developer"
};
