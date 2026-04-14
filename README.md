# Task Manager

A small task management app built with Angular 21 and Supabase. Create, search, edit, and remove tasks from a master-detail layout that works on mobile and desktop.

https://task-manager-cloudtalk.netlify.app/tasks

Deployed on Netlify — a live build is published from `main` via [.github/workflows/ci.yml](.github/workflows/ci.yml). The app will not run without a Supabase URL and anon key; there is no local fallback.

## What I built

- **Task list with infinite scroll.** Cursor pagination on `(created_at, id)` — stable under concurrent inserts and avoids an expensive `COUNT(*)` per page.
- **Debounced search.** Reactive form with `debounceTime` + `distinctUntilChanged`, cancelled reactively via `switchMap` so typing fast never lets a stale response overwrite fresh state.
- **Create / edit / complete flows.** Single reusable `TaskForm` component powers both create and edit dialogs. Complete (delete) is gated behind a confirmation dialog. Every mutation surfaces a success or error toast.
- **Master-detail routing.** Two named router outlets (`tasks-list` and `task-details`) drive the layout. On mobile, a `LayoutService` signal swaps which pane is visible. On desktop both render side-by-side.
- **Reactive data layer.** One trigger stream (`Subject<void>`) feeds the load pipeline; signals hold the state templates read. Details page uses `rxResource` so the task re-fetches automatically whenever the route id changes.

## Why these choices

- **Signals + RxJS hybrid, not one or the other.** Signals are the natural source of truth for state that templates read — direct, synchronous, no subscription lifecycle. RxJS is the right tool for async edges: debouncing search input, cancelling stale fetches via `switchMap`, mirroring signals into toasts via `effect()`. The service in [tasks.service.ts](src/app/tasks/services/tasks.service.ts) demonstrates the bridge — a `Subject` pipeline writes into signals in `tap`/`next` handlers.
- **Cursor pagination over offset.** Offset pagination is lossy under inserts (rows shift, duplicates appear). A `(created_at, id)` cursor stays stable and PostgREST's `.or()` syntax expresses the range cleanly.
- **Reusable form component.** Separating `TaskForm` (presentation + validation) from `TaskFormDialog` (container that calls the service) means the same form drop-in handles create or edit based on whether a task is passed via `MAT_DIALOG_DATA`.
- **Supabase.** Fast to stand up for a take-home, built-in REST layer, Row Level Security is the authorization model. The anon key is public by design so committing it for a demo is acceptable.

## Trade-offs

- **"Complete" is a hard delete.** Simpler data model, but lossy — completed tasks are gone, not archived. A confirmation dialog softens it, but the honest fix is a `status` enum and a "show completed" toggle. I flagged this as future work rather than hacking it in last.
- **No auth.** RLS policies are permissive (`to anon`), so anyone with the URL reads and writes the same table. For production I'd layer Supabase auth and scope every policy to `auth.uid()`.
- **No tests shipped.** The code is factored to be testable (pure signal updates in `tap`/`next` handlers, the form component has no service dependency), but I prioritized UX polish over coverage for this timebox.
- **Anon key in source.** It's a public key by design, but committing it in `environment.development.ts` would fail a security review in a real repo. CI writes it from a GitHub secret in `.github/workflows/ci.yml`.

## What I'd add with more time

- **Task status** (`pending` / `done`) with a "show completed" filter instead of hard delete.
- **Supabase auth** and per-user task ownership, with RLS scoped to `auth.uid()`.
- **Due dates** with overdue styling and a "due today" filter.
- **Optimistic updates** for edit and delete — mutate the signal immediately, revert on error.
- **Keyboard shortcuts**: `⌘K` to focus search, `n` to open the create dialog, `esc` to close detail pane.
- **Unit tests** for `TasksService` (verify `switchMap` cancels stale fetches) and `TaskForm` validation.
- **Drag-and-drop reordering** with a `position` column.
