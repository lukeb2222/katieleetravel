import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Contact form submissions
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
  adminNotes: text("adminNotes"),
  repliedAt: timestamp("repliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

// Client questionnaire responses
export const questionnaireResponses = mysqlTable("questionnaire_responses", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  destination: text("destination"),
  travelDates: varchar("travelDates", { length: 255 }),
  flexibility: varchar("flexibility", { length: 100 }),
  travelers: varchar("travelers", { length: 255 }),
  budget: varchar("budget", { length: 100 }),
  occasion: varchar("occasion", { length: 255 }),
  accommodationStyle: text("accommodationStyle"),
  interests: text("interests"),
  dietaryNeeds: text("dietaryNeeds"),
  mobilityNeeds: text("mobilityNeeds"),
  additionalNotes: text("additionalNotes"),
  status: mysqlEnum("status", ["new", "reviewed", "in_progress", "completed"]).default("new").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuestionnaireResponse = typeof questionnaireResponses.$inferSelect;
export type InsertQuestionnaireResponse = typeof questionnaireResponses.$inferInsert;

// Reviews - auto-approved if 5 stars, otherwise requires manual approval
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  location: varchar("location", { length: 200 }),
  rating: int("rating").notNull(),
  destination: varchar("destination", { length: 255 }),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
