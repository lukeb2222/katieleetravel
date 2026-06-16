import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("reviews.submit", () => {
  it("validates that rating must be between 1 and 5", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.submit({
        name: "Test",
        email: "test@test.com",
        rating: 0,
        content: "Great service!",
      })
    ).rejects.toThrow();

    await expect(
      caller.reviews.submit({
        name: "Test",
        email: "test@test.com",
        rating: 6,
        content: "Great service!",
      })
    ).rejects.toThrow();
  });

  it("validates that name, email, and content are required", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.submit({
        name: "",
        email: "test@test.com",
        rating: 5,
        content: "Great!",
      })
    ).rejects.toThrow();

    await expect(
      caller.reviews.submit({
        name: "Test",
        email: "invalid-email",
        rating: 5,
        content: "Great!",
      })
    ).rejects.toThrow();
  });
});

describe("contact.submit", () => {
  it("validates required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        firstName: "",
        lastName: "Doe",
        email: "test@test.com",
        message: "Hello",
      })
    ).rejects.toThrow();

    await expect(
      caller.contact.submit({
        firstName: "John",
        lastName: "Doe",
        email: "not-an-email",
        message: "Hello",
      })
    ).rejects.toThrow();
  });
});

describe("admin procedures", () => {
  it("rejects non-admin users from contact.list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.contact.list()).rejects.toThrow();
  });

  it("rejects non-admin users from reviews.list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.reviews.list()).rejects.toThrow();
  });

  it("rejects non-admin users from questionnaire.list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.questionnaire.list()).rejects.toThrow();
  });
});
