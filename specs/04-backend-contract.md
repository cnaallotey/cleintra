# Backend Architecture & Contract: Call & interaction logging per contact

## Firestore Data Model

### Subcollection: `businesses/{businessId}/contacts/{contactId}/interactions/{interactionId}`
- `id`: `string`
- `contactId`: `string`
- `outcome`: `InteractionOutcome` (`"Call - Connected" | "Call - Left Voicemail" | "Call - No Answer" | "Email Sent" | "Meeting / Discussion" | "Note / Other"`)
- `date`: `string` (ISO 8601 string)
- `notes`: `string | null`
- `createdAt`: `string`
- `updatedAt`: `string`

### Contact Model Extension
- `lastContactedAt`: `string | null` (Updated whenever interactions are created/updated/deleted)

## Store Operations
- `getContactInteractions(contactId: string): Interaction[]`
- `logContactInteraction(contactId: string, input: CreateInteractionInput): { interaction: Interaction; contact: Contact }`
- `updateContactInteraction(contactId: string, interactionId: string, input: UpdateInteractionInput): { interaction: Interaction; contact: Contact } | null`
- `deleteContactInteraction(contactId: string, interactionId: string): { success: boolean; contact: Contact }`
