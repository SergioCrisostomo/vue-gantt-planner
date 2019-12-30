const dateToString = date => {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(nr => (nr < 10 ? "0" + nr : nr))
    .join("-");
};

export default dateToString;
