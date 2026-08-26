export interface AuthUser {
  uid: string;
  email: string;
  businessName: string;
}

export interface BusinessAccount {
  id: string;
  name: string;
  email: string;
  ownerId: string;
  ownerName?: string | null;
  supportEmail?: string | null;
  phone?: string | null;
  currency?: string;
  industry?: string;
  authProvider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBusinessProfileInput {
  name: string;
  ownerName?: string | null;
  supportEmail?: string | null;
  phone?: string | null;
  currency?: string;
  industry?: string;
}

export interface SignUpInput {
  businessName: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthContextState {
  user: AuthUser | null;
  business: BusinessAccount | null;
  loading: boolean;
  error: string | null;
  signUp: (input: SignUpInput) => Promise<AuthUser>;
  signIn: (input: SignInInput) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser>;
  updateBusinessProfile: (input: UpdateBusinessProfileInput) => Promise<BusinessAccount>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
