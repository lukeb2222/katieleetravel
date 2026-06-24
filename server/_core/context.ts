import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { ENV } from "./env";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * Creates the tRPC context for each request.
 * Admin auth is password-based: if the request includes a valid x-admin-key header,
 * we create a synthetic admin user. Otherwise user is null (public access).
 */
export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  const adminKey = opts.req.headers["x-admin-key"] as string | undefined;

  if (adminKey && ENV.adminPassword && adminKey === ENV.adminPassword) {
    // Create a synthetic admin user for password-based auth
    user = {
      id: 1,
      openId: "admin",
      name: "Admin",
      email: ENV.notificationEmail,
      loginMethod: "password",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
