# Backend Architecture & Contract: Status and pipeline tracking per contact

## Data Model

### 1. Subcollection: `businesses/{businessId}/stages/{stageId}`
- `id`: `string` (e.g. `"stage_new_lead"`, `"stage_won"`)
- `name`: `string`
- `order`: `number`
- `color`: `"blue" | "amber" | "purple" | "emerald" | "gray" | "rose" | "indigo"`
- `isDefault`: `boolean`
- `createdAt`: `string`
- `updatedAt`: `string`

### Default Initial Stages
1. `New Lead` (blue, default: true)
2. `Contacted` (amber)
3. `Follow-up` (purple)
4. `Won` (emerald)
5. `Lost` (gray)

### 2. Contact Schema Additions
- `status`: `string` (Current stage name)
- `stageChangedAt`: `string | null` (Timestamp of last stage change)
- `updatedAt`: `string`

## API / Store Operations
1. `getPipelineStages(): PipelineStage[]`
2. `getPipelineStagesWithCounts(): PipelineStageWithCount[]`
3. `updateContactStage(contactId: string, stageName: string): Contact | null`
4. `createPipelineStage(name: string, color?: string): PipelineStage`
5. `updatePipelineStage(stageId: string, updates: { name?: string; color?: string }): PipelineStage | null`
6. `deletePipelineStage(stageId: string, reassignToStageName?: string): { success: boolean; reassignedCount: number }`
