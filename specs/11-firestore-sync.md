# Feature Spec: Real-Time Cloud Firestore Sync

## User goal
As a business owner, I want all of my CRM data—contacts, groups, pipeline stages, and activity history—to be automatically and securely saved to the cloud database in real time so that nothing is lost and my records are always up to date across devices and browser sessions.

## Flow
1. The user logs into their CRM workspace.
2. The user creates, edits, imports, or organizes contacts, pipeline stages, contact groups, or interaction logs.
3. Every change is immediately and seamlessly persisted to Cloud Firestore under their business account without requiring manual "Save" actions.
4. When the user refreshes the browser, logs in from another device, or works in multiple tabs, their latest data loads accurately and updates live.

## Acceptance criteria
- [ ] Every business account automatically creates and maintains a dedicated business profile document (`businesses/{businessId}`) upon setup.
- [ ] Creating, editing, or deleting contacts immediately writes and syncs to the database under `businesses/{businessId}/contacts/{contactId}`.
- [ ] Creating, modifying, or removing contact groups immediately persists to `businesses/{businessId}/groups/{groupId}`.
- [ ] Adding, reordering, renaming, or deleting pipeline stages persists directly to `businesses/{businessId}/stages/{stageId}`.
- [ ] Logging a call, note, email, meeting, or status change saves directly to `businesses/{businessId}/interactions/{interactionId}` and links to the relevant contact.
- [ ] Bulk uploading a contact list saves all validated contacts and associated groups to Firestore.
- [ ] Refreshing the browser or opening the CRM from an empty cache loads all saved business records directly from Firestore.
- [ ] Live real-time listeners update the CRM interface immediately when data is added or modified in the database.
- [ ] In the event of a brief network disconnection, pending changes sync automatically once connectivity is restored.
- [ ] If a database write encounters an error, a simple, non-technical notification alerts the user.

## Explicitly out of scope
- Manual database backup/restore controls or raw JSON database exports for users.
- Custom field schema designers.
- Complex multi-branch conflict resolution (standard last-write-wins is used).
