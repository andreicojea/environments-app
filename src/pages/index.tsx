import { authOptions } from "@/server/auth";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { UserNav } from "@/components/user-nav";
import { EnvironmentsTable } from "@/components/environments-table";

import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <>
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
    </>
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
