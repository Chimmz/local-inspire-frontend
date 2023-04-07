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
  followers: string[];
  createdAt: string;
  profileViews: number;
  blockedUsers: string[];
}

// Text Message
export interface PrivateMessage {
  text: string;
  from: Pick<UserPublicProfile, '_id' | 'firstName' | 'lastName'>;
  to: string;
  seen: boolean;
}

// Admin Filters
export interface AdminFilter {
  _id: string;
  createdBy: string;
  name: string;
  title: string;
  description: {
    text: string;
    showInSearchResultsPage: boolean;
    showInAddEditBusinessPage: boolean;
  };
  isActive: boolean;
  showForBusiness: boolean;
  showForFilter: boolean;
  category?: string;
  keywords: string[];
  SIC2Categories?: string[];
  SIC4Categories?: string[];
  SIC8Categories?: string[];
  tags: string[];
  keyOrder: number;
  formType: string;
}

export interface AdminSearchKeyword {
  _id: string;
  name: string;
  enableForBusiness: boolean;
  enableForFilter: boolean;
  sic4Categories: [string];
}
