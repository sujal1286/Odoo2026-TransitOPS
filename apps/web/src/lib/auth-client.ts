import { env } from "@Odoo2026-TransitOPS/env/web";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@Odoo2026-TransitOPS/auth";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : env.VITE_SERVER_URL,
  plugins: [
    inferAdditionalFields<typeof auth>()
  ]
});
