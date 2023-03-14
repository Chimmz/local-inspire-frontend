export interface NamedUser {
  firstName: string | undefined;
  lastName: string | undefined;
}

interface UserNameDisplayOptions {
  full?: boolean;
  lastNameInitial?: boolean;
  initials?: boolean;
}

export const getFullName = (
  user: NamedUser | undefined,
  options?: Partial<UserNameDisplayOptions>,
) => {
  if (!user) return null;
  if (!options || options?.full) return user?.firstName + ' ' + user?.lastName;
  if (options?.lastNameInitial) return user?.firstName + ' ' + user?.lastName?.[0] + '.';
  if (options?.initials) return user?.firstName?.[0] + '' + user?.lastName?.[0];
};
