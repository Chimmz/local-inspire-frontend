export const getPeopleQuantity = (n: number) => {
  switch (n) {
    case 0:
      return `${n} persons`;
    case 1:
      return `${n} person`;
    default:
      return `${n} persons`;
  }
};
