# TransitOps Fleet Management Platform

TransitOps is a smart, real-time transportation operations platform designed to handle fleet registry, driver safety logs, trip lifecycle workflows (dispatching, cancellation, and completion), maintenance tracking, fuel logs, and financial ROI reporting.

Developed using a monorepo workspace managed by Turborepo with Bun, the platform separates the client application and the API server under a type-safe architecture.

---

## 🚀 Tech Stack

*   **Runtime**: [Bun](https://bun.sh/)
*   **Monorepo Tooling**: [Turborepo](https://turbo.build/)
*   **Frontend**: React, [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query), TailwindCSS, shadcn-ui, Zustand
*   **Backend**: [Hono](https://hono.dev/)
*   **Database**: PostgreSQL & [Prisma ORM](https://www.prisma.io/)
*   **Authentication**: [Better Auth](https://www.better-auth.com/)
*   **Logging**: Winston Logger

---

## 📂 Project Structure

To maintain maximum code cleanliness and type safety, the application enforces a strict separation of concerns (no mixed endpoints or inline business logic):

```
Odoo2026-TransitOPS/
├── apps/
│   ├── web/                     # Frontend client (React + TanStack Router)
│   └── server/                  # Hono backend API
│       ├── src/
│       │   ├── controllers/     # HTTP Request handler/controllers
│       │   ├── services/        # Business logic & Prisma database transactions
│       │   ├── routes/          # Expressive endpoint routing
│       │   ├── schemas/         # Modular Zod validator schemas
│       │   └── docs/            # OpenAPI specifications and Swagger descriptions
├── packages/
│   ├── auth/                    # Better Auth server configuration
│   └── db/                      # Database schema declaration
```

---

## 🔐 Predefined Accounts & Roles

The system operates on an active Role-Based Access Control (RBAC) middleware. A seed file is provided to initialize default accounts using the Better Auth signup flow (which hashes passwords securely).

All default accounts share the password: **`Password123!`**

| User Role | Email address | Responsibilities & Access Permissions |
| :--- | :--- | :--- |
| **Fleet Manager** | `manager@transitops.com` | Full management access, vehicle/driver registry updates, dispatching, maintenance scheduling, and reporting. |
| **Safety Officer** | `safety@transitops.com` | Registry modifications (adding/updating vehicles and drivers), tracking driver licenses and incident reports. |
| **Dispatcher** | `dispatcher@transitops.com` | Booking trips, managing trip statuses (dispatching, cancellations, etc.). |
| **Financial Analyst** | `finance@transitops.com` | Logging operational expenses (Tolls, Food, Maintenance, Fuel), reviewing profitability analytics, and ROI reports. |
| **Driver** | `driver@transitops.com` | Checking trip assignments, completing assigned trips, updating odometers, and logging fuel. |

---

## 🛠️ Getting Started

### 1. Install Dependencies
Ensure you have [Bun](https://bun.sh/) installed, then run:
```bash
bun install
```

### 2. Configure Environment Variables
Create a `.env` file inside `apps/server/` matching the configuration settings:
```ini
DATABASE_URL="postgresql://username:password@localhost:5432/transitops"
BETTER_AUTH_SECRET="some-random-32-character-secret"
BETTER_AUTH_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3001"
```

### 3. Push Database Schema & Seed Data
Initialize your PostgreSQL database tables and run the seed script:
```bash
# Push database tables
bun run db:push

# Seed default user accounts, vehicles, drivers, trips, maintenance logs, and expenses
bun run db:seed
```

### 4. Run Development Servers
Start both the Hono backend API server (port 3000) and TanStack React web application (port 3001):
```bash
bun run dev
```

---

## 📡 API Reference & Scalar Playground

TransitOps exposes a fully documented OpenAPI specification. With the server running, navigate to the interactive Scalar sandbox to test endpoints and read response models:

👉 **[http://localhost:3000/reference](http://localhost:3000/reference)**

### Key Endpoint Directory

#### 🚚 Vehicles Registry
*   `GET /api/vehicles` - List vehicles with optional status/type/region filters.
*   `POST /api/vehicles` - Register a new vehicle. *(Restricted: `FLEET_MANAGER`, `SAFETY_OFFICER`)*
*   `PATCH /api/vehicles/:id` - Edit vehicle properties. *(Restricted: `FLEET_MANAGER`, `SAFETY_OFFICER`)*

#### 🧑‍✈️ Drivers Registry
*   `GET /api/drivers` - List driver profiles with availability and safety score filters.
*   `POST /api/drivers` - Register a new driver. *(Restricted: `FLEET_MANAGER`, `SAFETY_OFFICER`)*
*   `PATCH /api/drivers/:id` - Edit driver properties. *(Restricted: `FLEET_MANAGER`, `SAFETY_OFFICER`)*

#### 🗺️ Trips Management
*   `POST /api/trips` - Create a trip in `Draft` state. *(Restricted: `FLEET_MANAGER`, `DISPATCHER`)*
*   `PATCH /api/trips/:id/dispatch` - Transition trip to `Dispatched` (validates driver/vehicle availability, license validity, and load weight capacity using a transaction). *(Restricted: `FLEET_MANAGER`, `DISPATCHER`)*
*   `PATCH /api/trips/:id/complete` - Transition trip to `Completed` (updates vehicle odometer and logs fuel/operational expenses). *(Restricted: `FLEET_MANAGER`, `DISPATCHER`, `DRIVER`)*
*   `PATCH /api/trips/:id/cancel` - Cancel a trip and restore status of driver and vehicle to `Available`. *(Restricted: `FLEET_MANAGER`, `DISPATCHER`)*

#### 🔧 Servicing & Maintenance
*   `GET /api/maintenance` - Retrieve vehicle maintenance history logs.
*   `POST /api/maintenance` - Put a vehicle into the shop (updates vehicle status to `In Shop` and tracks maintenance expenses). *(Restricted: `FLEET_MANAGER`)*
*   `PATCH /api/maintenance/:id/close` - Complete maintenance and return vehicle to `Available` status. *(Restricted: `FLEET_MANAGER`)*

#### 💳 Fuel & Operating Expenses
*   `GET /api/expenses` - Fetch operating expense logs.
*   `POST /api/expenses` - Record a toll, food, fuel, maintenance, or other expense. *(Restricted: `FINANCIAL_ANALYST`)*
*   `GET /api/fuel-logs` - Retrieve fuel fill logs.
*   `POST /api/fuel-logs` - Log fuel liters, automatically generating a corresponding operating expense record.

#### 📊 Performance Reports & KPIs
*   `GET /api/dashboard/kpis` - Retrieve high-level statistics (fleet utilization %, active/available counts).
*   `GET /api/reports/analytics` - Aggregate per-vehicle operational metrics:
    *   **Fuel Efficiency** (Planned distance / Total liters filled)
    *   **Total Operational Cost** (Fuel + Maintenance + Tolls)
    *   **Vehicle ROI** ($\frac{\text{Revenue} - (\text{Maintenance} + \text{Fuel})}{\text{Acquisition Cost}}$)
    *   *(Restricted: `FLEET_MANAGER`, `FINANCIAL_ANALYST`)*

---

## ⚙️ Available Monorepo Scripts

Commands can be invoked directly from the root workspace:

*   `bun run dev` - Start Hono backend server and Vite frontend app concurrently.
*   `bun run dev:server` - Start only the backend API server.
*   `bun run dev:web` - Start only the frontend React application.
*   `bun run check-types` - Verify TypeScript compilation across the entire project.
*   `bun run db:studio` - Launch Prisma's interactive GUI workspace.
*   `bun run test` - Execute unit/integration tests with Vitest.
