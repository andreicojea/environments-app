import { asc, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { environments, users } from "@/server/db/schema";
import { env } from "@/env";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const apiKey = req.headers.authorization;

  if (!apiKey) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  if (apiKey !== `Bearer ${env.CRON_SECRET}`) {
    return res
      .status(401)
      .json({ message: "Authorization header is incorrect." });
  }

  const envs = await db
    .select({
      id: environments.id,
      name: environments.name,
      slug: environments.slug,
      reservedBy: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
      updatedAt: environments.updatedAt,
    })
    .from(environments)
    .leftJoin(users, eq(users.id, environments.reservedById))
    .orderBy(asc(environments.createdAt));

  return res.status(200).json(envs);
}
