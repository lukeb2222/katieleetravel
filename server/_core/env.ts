export const ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  notificationEmail: process.env.NOTIFICATION_EMAIL ?? "katie.lee@smartflyer.com",
  isProduction: process.env.NODE_ENV === "production",
};
