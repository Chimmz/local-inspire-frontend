interface GetPeopleQuantityOptions {
  onZeroReturnNull: boolean;
}

type SingularPluralForm = [string, string];

export const getPeopleQuantity = (n: number, opts?: GetPeopleQuantityOptions) => {
  switch (n) {
    case 0:
      return opts?.onZeroReturnNull ? null : `${n} persons`;
    case 1:
      return `${n} person`;
    default:
      return `${n} people`;
  }
};

export const quantitize = (n: number, [singular, plural]: SingularPluralForm) => {
  switch (+n) {
    case 0:
      return `0 ${plural}`;
    case 1:
      return `1 ${singular}`;
    default:
      return `${n} ${plural}`;
  }
};
