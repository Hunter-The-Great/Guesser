import { PrismaClient } from "@prisma/client";
import { sentry } from "./sentry";

let prisma;
try {
    prisma = new PrismaClient();
} catch (err) {
    sentry.captureException(err);
    console.log("WARNING: prisma client not generated");
}

export { prisma };
