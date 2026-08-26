# Feature Spec: Status and pipeline tracking per contact (customizable stages, sensible defaults)

## User goal
A small business owner wants to see at a glance where every prospect or customer is in their sales journey, quickly update a contact's stage, and adapt stage names to fit how they run their business without any technical setup.

## Flow
1. The user views their contacts and immediately sees their current status badge and a summary of how many contacts are in each stage.
2. The user can filter the contact list by stage or switch between a full list and stage-grouped view.
3. While viewing any contact (either in the contact list or inside the contact details view), the user can change the contact's stage with a simple dropdown or button tap.
4. When the user changes a stage, the UI updates instantly and records when the status changed.
5. If the business has unique steps, the user can open a simple "Pipeline Stages" setting to rename existing stages, add a new stage, or remove unused stages, with safe handling for contacts already in that stage.

## Acceptance criteria
- [ ] Sensible default stages are pre-configured: "New Lead", "Contacted", "Follow-up", "Won", "Lost".
- [ ] The contact record view contains an interactive stage selector allowing the user to update the contact's stage with one action.
- [ ] The main contact list displays a clear, color-coded stage badge for every contact.
- [ ] The user can filter contacts by stage from the main view with visible contact counts per stage.
- [ ] The user can customize pipeline stages: add a new stage, rename an existing stage, and delete a stage.
- [ ] If a user attempts to delete a stage containing contacts, the system prompts them to reassign those contacts to another stage first.
- [ ] Status updates persist across page reloads and update the contact's "last updated" timestamp.
- [ ] All stage management and status updates work seamlessly on both mobile screens and desktop browsers without horizontal scrolling or tiny hit targets.

## Explicitly out of scope
- Multiple simultaneous pipelines (e.g., separate pipelines for enterprise vs retail).
- Automated webhook, email, or SMS triggers on stage transitions.
- Deal value math, stage probabilities, or weighted revenue forecasting.
- Complex multi-level approval workflows for stage changes.
