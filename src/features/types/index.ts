import { BusinessProps } from '../components/business-results/Business';

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
  formType: 'input' | 'checkbox' | 'dropdown' | 'textarea' | 'slider';
  createdAt: string;
}

export interface AdminSearchKeyword {
  _id: string;
  name: string;
  enableForBusiness: boolean;
  enableForFilter: boolean;
  showOnNavbar: boolean;
  showForSearch: boolean;
  sic4Categories: [string];
}

export interface City {
  _id: string;
  name: string;
  stateCode: string;
  stateName: string;
  stateId: string;
  population: string;
  imgUrl: string;
  lat: string;
  lng: string;
  density: string;
  zips: string;
  price: {
    amount: number;
    currency?: string;
    stripePriceId?: string;
    stripePriceNickname?: string;
  };
  isFeatured: boolean;
  description: string;
  searchesCount: Number;
}

export interface BusinessClaim {
  _id: string;
  user: Pick<UserPublicProfile, '_id' | 'firstName' | 'lastName'>;
  business: Pick<BusinessProps, '_id' | 'businessName'>;
  businessPhone: number;
  businessEmail: string;
  currentPlan:
    | 'free'
    | 'sponsored_business_listing_monthly'
    | 'enhanced_business_profile_monthly'
    | 'sponsored_business_listing_yearly'
    | 'enhanced_business_profile_yearly';
  payment?: {
    status: string;
    amountPaid: number;
    currency: string;
    stripeSubscriptionId: string;
    paidDate: Date;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StripePrice {
  id: string;
  object: string;
  active: true;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: string | null;
  livemode: false;
  lookup_key: string | null;
  metadata: {};
  nickname: string;
  product: string;
  recurring: {
    aggregate_usage: any;
    interval: string;
    interval_count: number;
    trial_period_days: number | null;
    usage_type: string;
  };
  tax_behavior: string;
  tiers_mode: null;
  transform_quantity: null;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}
