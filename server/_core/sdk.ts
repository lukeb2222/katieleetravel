// OAuth SDK is not used in this project - admin auth is password-based
import type { User } from "../../drizzle/schema";

export type AuthenticatedUser = User & {
  taskUid?: string;
  isCron?: boolean;
};

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

export const sdk = {
  verifySession: async (_cookie: string | undefined | null) => null,
  authenticateRequest: async (_req: any) => null as any,
  createSessionToken: async (_openId: string) => "",
  signSession: async (_payload: SessionPayload) => "",
};
