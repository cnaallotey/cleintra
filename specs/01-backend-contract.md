# Backend Architecture & Contract: Contact list upload (CSV import) with validation

## Firestore Data Model

### 1. `businesses/{businessId}` (Document)
- `id`: `string` — Business / Account ID (matches owner Firebase Auth UID for MVP).
- `name`: `string` — Business name.
- `ownerId`: `string` — Firebase Auth UID.
- `createdAt`: `Timestamp`
- `updatedAt`: `Timestamp`

### 2. `businesses/{businessId}/contacts/{contactId}` (Subcollection)
- `id`: `string` — Auto-generated Firestore document ID.
- `name`: `string` — Contact's full name.
- `phone`: `string | null` — Sanitized phone number.
- `email`: `string | null` — Lowercased email address.
- `source`: `string | null` — Lead source.
- `notes`: `string | null` — Free-text notes or initial comments.
- `status`: `string` — Default starting pipeline stage: `"New Lead"`.
- `importedAt`: `Timestamp`
- `createdAt`: `Timestamp`
- `updatedAt`: `Timestamp`

## API / Server Actions Contract

### 1. Sample CSV Download
- **Route:** `GET /api/contacts/template`
- **Output:** CSV file `sample-contacts.csv` with headers `Name,Phone,Email,Source,Notes`.

### 2. Validation & Preview
- **Function/Action:** `validateContactsCsv(csvText: string | File)`
- **Response:**
```typescript
interface ValidateContactsResponse {
  success: boolean;
  totalRows: number;
  validCount: number;
  errorCount: number;
  validContacts: Array<{
    tempId: string;
    name: string;
    phone: string | null;
    email: string | null;
    source: string | null;
    notes: string | null;
  }>;
  errors: Array<{
    rowNumber: number;
    message: string;
    rawRow?: Record<string, string>;
  }>;
}
```

### 3. Batch Import
- **Server Action:** `importContacts(contacts: ValidContact[])`
- **Response:**
```typescript
interface ImportContactsResult {
  success: boolean;
  importedCount: number;
  error?: string;
}
```

## Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isBusinessOwner(businessId) {
      return isAuthenticated() && request.auth.uid == businessId;
    }
    match /businesses/{businessId} {
      allow read, write: if isBusinessOwner(businessId);
      match /contacts/{contactId} {
        allow read, write: if isBusinessOwner(businessId);
      }
    }
  }
}
```
