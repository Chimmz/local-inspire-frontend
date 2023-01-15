export type Readonly = { readonly: true };
export type Changable = { readonly: false };

export type Size = 'sm' | 'md' | 'lg' | 'xlg';

export interface UserPublicProfile {
  _id: string;
  firstName: string;
  lastName: string;
  imgUrl: string;
  role: 'USER' | 'CITY_MANAGER' | 'BUSINESS_OWNER' | 'MAIN_ADMIN';
}