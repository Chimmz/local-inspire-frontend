export const getFullName = (user: {
  firstName: string | undefined;
  lastName: string | undefined;
}) => {
  if (!user) return '';
  return user?.firstName + ' ' + user?.lastName;
};
