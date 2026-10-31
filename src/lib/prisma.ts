import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL fallback if running without env vars
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgres://c52bbb59164ea088249fb9e1476437d100015634a82f9d3d10cd5f8ba6ae29a5:sk_0blSif17gZa_tfw3D-7YE@pooled.db.prisma.io:5432/postgres?sslmode=require";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
