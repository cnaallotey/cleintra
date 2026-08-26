# Backend Architecture & Contract: Simple dashboard / list view with filtering by status

## Query Function Contract
- `getDashboardContacts(filters: DashboardFilterParams): DashboardContactsResponse`
- Parameters: `status?: string`, `q?: string`
- Output: `contacts: Contact[]`, `stageSummaries: StageCountSummary[]`, `totalCount: number`, `filteredCount: number`

## URL Search Params Contract
- `?status=<StageName>` (e.g. `?status=Follow-up`, `?status=Won`)
- `?q=<SearchKeyword>` (e.g. `?q=Kwame`)
- `?status=Follow-up&q=Kwame`
- Synchronized bidirectionally with Next.js router (`useSearchParams`, `useRouter`, `usePathname`).
