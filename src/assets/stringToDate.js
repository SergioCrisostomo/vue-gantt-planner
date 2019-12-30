const stringToDate = str => {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default stringToDate;
