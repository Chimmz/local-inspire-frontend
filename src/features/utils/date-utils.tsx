import { monthsOfTheYear } from '../data/constants';

export const getPast12MonthsWithYear = (): string[] => {
  const pastMonths = [];
  const now = new Date();

  for (var i = 0; i > -12; i--) {
    var future = new Date(now.getFullYear(), now.getMonth() + i, 1);
    var month = monthsOfTheYear[future.getMonth()];
    var year = future.getFullYear();
    pastMonths.push([month, year].join(' '));
  }
  return pastMonths;
};
