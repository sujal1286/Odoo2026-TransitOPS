import { auth } from "@Odoo2026-TransitOPS/auth";
import { env } from "@Odoo2026-TransitOPS/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { apiReference } from "@scalar/hono-api-reference";
import { errorResponse } from "./lib/api-response";
import { logger as winstonLogger } from "./lib/logger";
import { openapiSpec } from "./docs/openapi";
import router from "./routes/index";

const app = new Hono();

app.use(logger());

app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);


app.onError((err, c) => {
  winstonLogger.error("Unhandled server error:", err);
  return errorResponse(c, err.message || "Internal Server Error", "INTERNAL_SERVER_ERROR", 500);
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/openapi.json", (c) => c.json(openapiSpec));
app.get("/reference", apiReference({ spec: { url: "/openapi.json" } }));


app.route("/api", router);

app.get("/", (c) => {
  return c.text("TransitOps API Server is Running");
});

export default app;
