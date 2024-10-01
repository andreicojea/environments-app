import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { db } from "@/server/db";
import { environments, users } from "@/server/db/schema";

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

  const payloadSchema = z.object({
    environment: z.string().min(1),
    userEmail: z.string().email(),
  });

  const parsed = payloadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(parsed.error);
  }

  const payload = parsed.data!;

  const foundUser = await db.query.users.findFirst({
    where: eq(users.email, payload.userEmail),
  });

  if (!foundUser) {
    return res.status(404).json({ message: "User not found." });
  }

  const foundEnvironment = await db.query.environments.findFirst({
    where: eq(environments.slug, payload.environment),
  });

  if (!foundEnvironment) {
    return res.status(404).json({ message: "Environment not found." });
  }

  if (foundEnvironment.reservedById) {
    return foundEnvironment.reservedById === foundUser.id
      ? res.status(200).json({ message: "Already reserved." })
      : res.status(403).json({ message: "Reserved by someone else." });
  }

  await db
    .update(environments)
    .set({
      reservedById: foundUser.id,
    })
    .where(eq(environments.id, foundEnvironment.id));

  return res.status(200).json({ message: "Successfully reserved." });
}
