# TransitOps Hackathon: 2-Developer Implementation Plan

This plan organizes the 6-hour hackathon tasks into parallel tracks for **Developer 1 (Backend & Infra)** and **Developer 2 (Frontend & UI)**.

---

## 🛠️ Technology Stack & Shared Responsibilities

*   **Package Manager & Runtime**: Bun (turborepo)
*   **Database & Auth**: Prisma + PostgreSQL, Better Auth
*   **Frontend**: TanStack Router + Zustand + TailwindCSS + Shadcn UI

---

## 📅 Hourly Roadmap & Developer Split

### Hour 1: Infrastructure, Routing & Auth Setup
*   **Developer 1 (Backend / Infra)**:
    *   Initialize Winston logger in `apps/server/src/lib/logger.ts`.
    *   Verify the Postgres DB connection and execute `bun run packages/db/src/seed.ts`.
    *   Set up Hono middleware to extract and validate session details via `auth.api.getSession()`.
    *   Create a reusable `roleMiddleware` to restrict Hono endpoints by user roles.
*   **Developer 2 (Frontend / UI)**:
    *   Define the TanStack Router route tree in `apps/web/src/routes/` (`/login`, `/dashboard`, `/vehicles`, `/drivers`, `/trips`, `/maintenance`, `/expenses`, `/reports`).
    *   Build the main application shell featuring a responsive navigation sidebar and a top breadcrumbs navbar.
    *   Create a Zustand auth store (`useAuthStore`) to manage user profiles, roles, and session states.
    *   Write a global API fetch client (`api.ts`) configured with credentials for session cookie synchronization.
*   **🤝 Sync @ 1hr**: Verify session authentication. Dev 2 submits login request to Hono server; Dev 1 validates that cookie-based sessions are established and cookies are set with appropriate SameSite and Secure attributes.

---

### Hour 2: Registry Management & CRUD Interfaces
*   **Developer 1 (Backend / Infra)**:
    *   Build `/api/vehicles` (GET to support type, status, and region filters; POST/PATCH to enforce registration number uniqueness).
    *   Build `/api/drivers` (GET to filter by status/availability; POST/PATCH to manage contact info and safety score updates).
    *   Create `/api/dashboard/kpis` endpoint to retrieve active vehicles, available vehicles, in-shop count, pending/active trips, and fleet utilization %.
*   **Developer 2 (Frontend / UI)**:
    *   Develop the **Dashboard** view with 7 KPI summary cards and a Recharts bar chart showing vehicle types and statuses.
    *   Develop the **Vehicle Registry** view featuring a search/filter bar, a tabular list, and a modal (Shadcn Dialog + React Hook Form) to Add/Edit vehicles.
    *   Develop the **Driver Management** view highlighting near-expired licenses (marked in red if expiry is $<30$ days) and custom status toggles.
*   **🤝 Sync @ 2hr**: Wire vehicle and driver tables to the Hono API endpoints. Verify that creating a vehicle/driver updates the lists instantly and shows success toasts.

---

### Hour 3: Trip Lifecycle & Dispatch Logic (Critical Phase)
*   **Developer 1 (Backend / Infra)**:
    *   Create `POST /api/trips` to initialize a trip in the `Draft` state.
    *   Create `PATCH /api/trips/:id/dispatch` utilizing a Prisma `$transaction` to validate all dispatch rules:
        *   Vehicle must be `Available` (not Retired or In Shop).
        *   Driver must be `Available` (not Suspended or Off Duty).
        *   Driver license must not be expired.
        *   Cargo weight must not exceed vehicle load capacity.
        *   Updates vehicle and driver status to `On Trip`, and trip to `Dispatched`.
    *   Create `PATCH /api/trips/:id/complete` (updates vehicle odometer, restores statuses to `Available`, and registers a `FuelLog`).
    *   Create `PATCH /api/trips/:id/cancel` (reverts status updates back to `Available`).
*   **Developer 2 (Frontend / UI)**:
    *   Build the **Trip Dispatcher Console** with an interactive stepper indicating the trip states: Draft $\to$ Dispatched $\to$ Completed/Cancelled.
    *   Integrate validation warnings on trip creation: display a red block warning if Cargo Weight exceeds the selected vehicle's capacity.
    *   Build the **Live Board** showing active trips and quick-action buttons (Dispatch, Complete, Cancel).
*   **🤝 Sync @ 3hr**: Execute a full end-to-end trip walkthrough: Register a vehicle $\to$ assign a driver $\to$ create a trip $\to$ dispatch (verify status updates in DB) $\to$ complete/cancel.

---

### Hour 4: Maintenance Workflows, Fuel & Expenses
*   **Developer 1 (Backend / Infra)**:
    *   Create `POST /api/maintenance` (automatically transitions vehicle status to `In Shop`).
    *   Create `PATCH /api/maintenance/:id/close` (transitions vehicle back to `Available` unless status is `Retired`).
    *   Develop `GET/POST /api/fuel-logs` and `GET/POST /api/expenses` endpoints.
*   **Developer 2 (Frontend / UI)**:
    *   Design the **Maintenance Console**: dual-panel layout displaying active vehicle service logs and a submission form to initiate maintenance.
    *   Design the **Fuel & Expense Logger**: expense listings, fuel inputs, and an auto-calculating total operational cost component at the bottom.
*   **🤝 Sync @ 4hr**: Confirm that logging a vehicle into maintenance locks it out from the Trip Dispatch dropdown. Verify cost aggregations.

---

### Hour 5: Reports, Analytics & RBAC Enforcement
*   **Developer 1 (Backend / Infra)**:
    *   Create `GET /api/reports/analytics` to aggregate per-vehicle statistics:
        *   Fuel Efficiency (planned distance / total liters).
        *   Total Operational Cost (fuel + maintenance + tolls).
        *   Vehicle ROI: $\frac{\text{Revenue} - (\text{Maintenance} + \text{Fuel})}{\text{Acquisition Cost}}$.
    *   Apply role middlewares to restrict writes: limit registry changes to `FLEET_MANAGER`/`SAFETY_OFFICER` and expenses to `FINANCIAL_ANALYST`.
*   **Developer 2 (Frontend / UI)**:
    *   Build the **Reports & ROI** view: tabulating vehicle efficiency, cost, and ROI.
    *   Write a client-side CSV exporter (parsing JSON state to CSV string and triggering download).
    *   Implement role-based interface visibility: hide write operations/nav links depending on the logged-in user's role.
*   **🤝 Sync @ 5hr**: Test role permissions: log in as a Driver, verify that Fleet Management views and Analytics exports are blocked or hidden.

---

### Hour 6: Hardening, Polish & Documentation
*   **Developer 1 & Developer 2 (Jointly)**:
    *   Perform a final end-to-end integration pass.
    *   Refine typography, add glassmorphic styling enhancements, and polish transitions.
    *   Write clear setup instructions in `README.md` including pre-seeded user credentials.
