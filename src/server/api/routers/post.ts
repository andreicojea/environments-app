import { z } from "zod";
import { asc, eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { environments, posts, users } from "@/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getEnvironments: publicProcedure.query(async ({ ctx }) => {
    const envs = await ctx.db
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

    return envs;
  }),

  reserve: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.db
        .update(environments)
        .set({
          reservedById: ctx.session.user.id,
        })
        .where(eq(environments.id, id));
    }),

  release: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.db
        .update(environments)
        .set({
          reservedById: null,
        })
        .where(eq(environments.id, id));
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
