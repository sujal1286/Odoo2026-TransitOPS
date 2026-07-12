import prisma from "@Odoo2026-TransitOPS/db";
import { env } from "@Odoo2026-TransitOPS/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "DISPATCHER",
      },
    },
  },
  // advanced: {
  //   defaultCookieAttributes: {
  //     sameSite: "none",
  //     secure: true,
  //     httpOnly: true,
  //   },
  // },
  plugins: [],
});
