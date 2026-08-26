# Backend Architecture & Contract: Real-Time Cloud Firestore Sync

## Data Model & Hierarchy
- `businesses/{businessId}`
- `businesses/{businessId}/contacts/{contactId}`
- `businesses/{businessId}/groups/{groupId}`
- `businesses/{businessId}/stages/{stageId}`
- `businesses/{businessId}/interactions/{interactionId}`

## Sync Service (`src/lib/firestore-sync.ts`)
- Real-time `onSnapshot` subscriptions:
  - `subscribeToContacts`
  - `subscribeToGroups`
  - `subscribeToStages`
  - `subscribeToInteractions`
- Async writes with batching ($\le 450$ per chunk):
  - `syncSetContact`
  - `syncBatchImportContacts`
  - `syncSetGroup`
  - `syncDeleteGroup`
  - `syncSaveStages`
  - `syncLogInteraction`

## Security Rules
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && request.auth.uid == businessId;
      
      match /contacts/{contactId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      match /groups/{groupId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      match /stages/{stageId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      match /interactions/{interactionId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
    }
  }
}
```
