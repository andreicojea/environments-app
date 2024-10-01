import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type Profile,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import axios from "axios";

export interface BitbucketProfile {
  display_name: string;
  links: BitbucketProfileLinks;
  created_on: Date;
  type: string;
  uuid: string;
  has_2fa_enabled: null;
  username: string;
  is_staff: boolean;
  account_id: string;
  nickname: string;
  account_status: string;
  location: null;
}

export interface BitbucketProfileLinks {
  self: BitbucketAvatarResource;
  avatar: BitbucketAvatarResource;
  repositories: BitbucketAvatarResource;
  snippets: BitbucketAvatarResource;
  html: BitbucketAvatarResource;
  hooks: BitbucketAvatarResource;
}

export interface BitbucketAvatarResource {
  href: string;
}

export interface BitbucketEmailsResponse {
  values: BitbucketEmailResource[];
  pagelen: number;
  size: number;
  page: number;
}

export interface BitbucketEmailResource {
  type: string;
  links: null[];
  email: string;
  is_primary: boolean;
  is_confirmed: boolean;
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    {
      id: "bitbucket",
      name: "Bitbucket",
      type: "oauth",
      authorization: {
        url: `https://bitbucket.org/site/oauth2/authorize`,
        params: {
          scope: "email account",
          response_type: "code",
        },
      },
      token: `https://bitbucket.org/site/oauth2/access_token`,
      userinfo: {
        request: ({ tokens }) =>
          axios
            .get<Profile>("https://api.bitbucket.org/2.0/user", {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                Accept: "application/json",
              },
            })
            .then((r) => {
              console.log(r.data);
              return r.data;
            }),
      },
      async profile(profile: BitbucketProfile, tokens) {
        console.log(profile);
        const email = await axios
          .get<BitbucketEmailsResponse>(
            "https://api.bitbucket.org/2.0/user/emails",
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                Accept: "application/json",
              },
            },
          )
          .then((r) => {
            // find the primary email, or the first available email
            return (r.data.values.find((value) => value.is_primary) ??
              r.data.values[0])!.email;
          });

        console.log({
          id: profile.account_id,
          email,
          image: profile.links.avatar.href,
          name: profile.display_name,
        });

        return {
          id: profile.uuid,
          name: profile.display_name,
          email,
          image: profile.links.avatar.href,
        };
      },
      options: {
        clientId: env.BITBUCKET_CLIENT_ID,
        clientSecret: env.BITBUCKET_CLIENT_SECRET,
      },
    },
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
