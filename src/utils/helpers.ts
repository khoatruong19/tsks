import moment from "moment";

const isTomorrow = (date: Date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (tomorrow.toDateString() === date.toDateString()) {
    return true;
  }

  return false;
};

const isToday = (date: Date) => {
  const today = new Date();
  today.setDate(today.getDate());

  if (today.toDateString() === date.toDateString()) {
    return true;
  }

  return false;
};

export const formatDateToString = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  else return moment(date).format("L");
};
