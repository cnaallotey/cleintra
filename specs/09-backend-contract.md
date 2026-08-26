# Backend Architecture & Contract: Business Profile & Settings Page (`/settings`)

## Data Model
- `BusinessAccount`:
  - `id: string`
  - `name: string`
  - `email: string`
  - `ownerId: string`
  - `ownerName?: string | null`
  - `supportEmail?: string | null`
  - `phone?: string | null`
  - `currency?: string`
  - `industry?: string`
  - `authProvider?: string`
  - `createdAt: string`
  - `updatedAt: string`

## Auth & Store Contracts
- `updateBusinessProfile: (input: UpdateBusinessProfileInput) => Promise<BusinessAccount>`
- Live `displayName` and Firestore document synchronization
- Local account fallback persistence and live `AuthContext` state propagation

## Validation
- Business Name required (min 2 chars)
- Support Email optional, format checked
- Currency defaults to `GHS`
- Industry defaults to `Services`
