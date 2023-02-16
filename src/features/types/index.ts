export type Readonly = { readonly: true };
export type Changable = { readonly: false };

export type Size = 'sm' | 'md' | 'lg' | 'xlg';

export interface UserCollection {
  name: string;
  isPrivate: boolean;
  coverPhotoUrl: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  items: { item: string; model: 'Business'; _id: string }[];
}

export interface UserPublicProfile {
  _id: string;
  firstName: string;
  lastName: string;
  imgUrl: string;
  role: 'USER' | 'CITY_MANAGER' | 'BUSINESS_OWNER' | 'MAIN_ADMIN';
  city: string;
  location: { city: string; cityName: string; stateCode: string };
  contributions: {
    _id: string;
    contribution: string;
    model: 'BusinessReview' | 'BusinessQuestion' | 'BusinessAnswer';
  }[];
  collections: Array<UserCollection>;
}
