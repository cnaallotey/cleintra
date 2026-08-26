export type StageColor = 
  | "blue" 
  | "amber" 
  | "purple" 
  | "emerald" 
  | "gray" 
  | "rose" 
  | "indigo";

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: StageColor;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStageWithCount extends PipelineStage {
  contactCount: number;
}

export type ContactStatus = string;

export interface ContactGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactGroupWithCount extends ContactGroup {
  contactCount: number;
}

export interface CreateContactGroupInput {
  name: string;
}

export interface UpdateContactGroupInput {
  name: string;
}

export type InteractionOutcome =
  | "Call - Connected"
  | "Call - Left Voicemail"
  | "Call - No Answer"
  | "Email Sent"
  | "Meeting / Discussion"
  | "Note / Other";

export interface Interaction {
  id: string;
  contactId: string;
  outcome: InteractionOutcome;
  date: string; // ISO 8601
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInteractionInput {
  outcome: InteractionOutcome;
  date?: string;
  notes?: string | null;
}

export interface UpdateInteractionInput {
  outcome?: InteractionOutcome;
  date?: string;
  notes?: string | null;
}

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  notes: string | null;
  status: ContactStatus;
  groupId?: string | null;
  stageChangedAt?: string | null;
  lastContactedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  importedAt?: string;
}

export interface ValidContactInput {
  tempId: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  notes: string | null;
  status?: string;
  groupId?: string | null;
}

export interface RowValidationError {
  rowNumber: number;
  message: string;
  rawRow?: Record<string, string>;
}

export interface ValidationSummary {
  totalRows: number;
  validCount: number;
  errorCount: number;
  validContacts: ValidContactInput[];
  errors: RowValidationError[];
  fileName?: string;
}

export interface DashboardFilterParams {
  status?: string | null;
  groupId?: string | null;
  q?: string | null;
}

export interface DashboardContactsResponse {
  contacts: Contact[];
  stageSummaries: PipelineStageWithCount[];
  groupSummaries: ContactGroupWithCount[];
  unassignedGroupCount: number;
  totalCount: number;
  filteredCount: number;
}
