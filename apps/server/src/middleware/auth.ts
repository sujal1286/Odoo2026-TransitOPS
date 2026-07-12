import { auth } from "@Odoo2026-TransitOPS/auth";
import type { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    
    if (!session) {
      return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
    }
    
    // Store in context for downstream handlers
    c.set("session", session);
    await next();
  } catch (err: any) {
    return c.json({ error: "Authentication failed", details: err.message }, 401);
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    try {
      const session = c.get("session") || await auth.api.getSession({ headers: c.req.raw.headers });
      
      if (!session) {
        return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
      }
      
      const userRole = session.user.role;
      if (!allowedRoles.includes(userRole)) {
        return c.json({ error: "Forbidden", code: "FORBIDDEN" }, 403);
      }
      
      c.set("session", session);
      await next();
    } catch (err: any) {
      return c.json({ error: "Authorization failed", details: err.message }, 403);
    }
  };
};
