import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Export all the generated types
export * from "@prisma/client";
