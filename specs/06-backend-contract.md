# Backend Architecture & Contract: Basic User Auth (Single Business Account)

## Data Model & Tenant Scoping
- `businesses/{businessId}`: Root business account document (`id`, `name`, `email`, `ownerId`, `createdAt`, `updatedAt`)
- Subcollections scoped under `businesses/{businessId}`:
  - `businesses/{businessId}/contacts/{contactId}`
  - `businesses/{businessId}/stages/{stageId}`
  - `businesses/{businessId}/contacts/{contactId}/interactions/{interactionId}`

## Auth Store & Client Contract (`src/lib/auth-context.tsx` & `src/types/auth.ts`)
- `signUp(input: SignUpInput): Promise<AuthUser>`
- `signIn(input: SignInInput): Promise<AuthUser>`
- `signOut(): Promise<void>`
- `useAuth(): AuthContextState`
- Friendly error mapping for auth failures.

## Security Rules
- Full tenant isolation under `/businesses/{businessId}` requiring `request.auth.uid == businessId`.
