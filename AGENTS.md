# AGENTS.md — Simple CRM

This file is the entry point Antigravity reads to understand this
workspace's team of agents and how they should work together. It doesn't
replace the individual agent definitions in `.agents/` — it tells the
orchestrating session how to route work between them.

## Project

A lightweight CRM for small businesses, built on the FormDrop
form-backend concept. Businesses upload a list of contacts, the list is
validated, and each contact is tracked through a simple status/pipeline
(not contacted, called, follow-up needed, converted, closed). Primary use
case is sales lead tracking, secondary use case is general customer
follow-up. Must stay simple enough for a non-technical small business
owner to use without training.

**Stack:** Next.js and Firebase (Firestore, Firebase Auth, Firebase
Storage), TypeScript throughout.

## The team

This workspace defines five custom agents in `.agents/`. Each has its own
scoped tools and a narrow responsibility. Do not merge their roles or let
one agent silently do another's job, the value of this setup depends on
each role staying honest to its own perspective.

| Agent | File | Responsibility |
|---|---|---|
| `product-owner` | `.agents/01-product-owner-agent.md` | Writes feature specs and acceptance criteria; decides scope from feedback |
| `architect-backend` | `.agents/02-architect-backend-agent.md` | Firestore data model, API/server-action contracts, validation, security rules |
| `frontend` | `.agents/03-frontend-agent.md` | Implements UI in Next.js/Tailwind against spec and API contract |
| `qa` | `.agents/04-qa-agent.md` | Tests implementation against acceptance criteria, files bugs |
| `crm-user` | `.agents/05-crm-user-agent.md` | Roleplays a first-time small business owner, reports friction in plain language |
| `lead-convert-seo` | `.agents/06-lead-convert-seo-agent.md` | Optimizes search ranking, structured data (JSON-LD), landing page copy, and conversion funnels |
| `ui-designer` | `.agents/07-ui-designer-agent.md` | Leads visual design system, color palettes, bento layouts, and UI component specifications |

## Landing Page Redesign & Conversion Workflow

For public landing page and marketing surface work, follow this specialized sequence:
1. `lead-convert-seo` creates high-converting section copy, search-intent keyword architecture, value propositions, social proof hooks, and FAQ schema.
2. `ui-designer` synthesizes the SEO copy with design inspiration (e.g. editorial dark green/lime palette, bento cards, layered workflow stack) and produces a comprehensive UI layout specification.
3. `frontend` implements the landing page in Next.js and Tailwind CSS with responsive, accessible, flat (shadowless) components.
4. `qa` and `crm-user` evaluate the live page for conversion appeal, clarity, performance, and mobile feel.

## Orchestration rules

1. Work proceeds one feature area at a time, never the whole product at
   once. See the MVP feature list below for the starting scope and order.
2. Within a feature area, follow this sequence and do not skip a step:
   `product-owner` → `architect-backend` → `frontend` → `qa` → `crm-user`
   → back to `product-owner` to triage feedback.
3. `qa` and `crm-user` run independently of each other, in either order,
   but both must complete before `product-owner` triages results for that
   feature.
4. `product-owner` is the only agent allowed to change what's in scope.
   If `architect-backend`, `frontend`, `qa`, or `crm-user` hit something
   that seems out of spec, they raise it, they don't decide it.
5. A feature area is "done" only when `qa` has no open bugs against
   stated acceptance criteria and `product-owner` has triaged all
   `crm-user` feedback (accepted into this feature, deferred to backlog,
   or explicitly rejected with a reason).
6. Keep a running backlog (a markdown file, e.g. `BACKLOG.md`) of
   deferred ideas raised by any agent so nothing gets silently dropped
   between feature cycles.

## Workflow

Use `/run-feature-cycle` (defined in `.agents/workflows/` or wherever
this project's Workflows live) to run steps 2–5 above for a single named
feature area in one go, rather than invoking each agent by hand.

## MVP feature list (starting scope, in order)

1. Contact list upload (CSV import) with validation
2. Contact record view (name, phone, email, source, status)
3. Status/pipeline tracking per contact (customizable stages, sensible defaults)
4. Call/interaction logging per contact (date, outcome, notes)
5. Simple dashboard/list view with filtering by status
6. Basic user auth (single business account, no multi-seat needed for MVP)

Explicitly out of scope for MVP: automation, WhatsApp integration,
reporting/analytics dashboards, multi-user permissions. These go to
`BACKLOG.md` if raised, not into the active feature list.

## Safety / guardrails

- Never modify Firestore security rules without `architect-backend`
  proposing them first and a human reviewing before deploy.
- Never commit Firebase service account keys or `.env` files.
- `frontend` and `architect-backend` may edit code and run commands;
  `qa` and `crm-user` may use the browser to test but should not modify
  application code, if they think code needs to change, that's a bug
  report or feedback item, not a direct edit.
