import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "@/utils/api";
import { authOptions } from "@/server/auth";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { GeistSans } from "geist/font/sans";
import { UserNav } from "@/components/user-nav";
import { EnvironmentsTable } from "@/components/environments-table";

import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Environments App</title>
        <meta
          name="description"
          content="Frictionless deployment for lower environments at Mosaic"
        />
        <link rel="icon" href="/favicon.ico" />
        <body className={GeistSans.className}></body>
      </Head>

      <div className="flex flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Image
              src="/mosaic-logo.svg"
              alt="Mosaic Logo"
              width="32"
              height="32"
              className="mr-2 h-[32px] w-[32px]"
            />
            <h2 className="text-xl font-semibold">Environments App</h2>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EnvironmentsTable />
        </div>
      </div>

      <Toaster />

      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main> */}
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData, status } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {status}
        <br />
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (!session) {
    return { redirect: { destination: "/auth/signin" } };
  }

  return {
    props: {},
  };
}
