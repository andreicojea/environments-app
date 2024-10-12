import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { db } from "@/server/db";
import { accounts, environments } from "@/server/db/schema";
import { env } from "@/env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const apiKey = req.headers.authorization;

  if (!apiKey) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  if (apiKey !== `Bearer ${env.API_KEY_SECRET}`) {
    return res
      .status(401)
      .json({ message: "Authorization header is incorrect." });
  }

  const payloadSchema = z.object({
    environment: z.string().min(1),
    bitbucketUserId: z.string().min(1),
  });

  const parsed = payloadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(parsed.error);
  }

  const payload = parsed.data!;

  const foundAccount = await db.query.accounts.findFirst({
    where: eq(accounts.providerAccountId, payload.bitbucketUserId),
  });

  if (!foundAccount) {
    return res.status(404).json({ message: "Account not found." });
  }

  const foundEnvironment = await db.query.environments.findFirst({
    where: eq(environments.slug, payload.environment),
  });

  if (!foundEnvironment) {
    return res.status(404).json({ message: "Environment not found." });
  }

  if (foundEnvironment.reservedById) {
    return foundEnvironment.reservedById === foundAccount.userId
      ? res.status(200).json({ message: "Already reserved." })
      : res.status(403).json({ message: "Reserved by someone else." });
  }

  await db
    .update(environments)
    .set({
      reservedById: foundAccount.userId,
    })
    .where(eq(environments.id, foundEnvironment.id));

  return res.status(200).json({ message: "Successfully reserved." });
}
