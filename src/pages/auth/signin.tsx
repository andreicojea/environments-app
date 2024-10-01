import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";

export default function SignIn() {
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">Environments App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-center text-sm">
              Frictionless deployment for
              <br />
              lower environments at Mosaic
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  <Image
                    src="/mosaic-logo.svg"
                    alt="Mosaic Logo"
                    width="32"
                    height="32"
                    className="h-[32px] w-[32px]"
                  />
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {/* <Button className="w-full" onClick={() => signIn("google")}>
              <Icons.google className="mr-2 size-4" />
              Sign in with Google
            </Button> */}
            <Button className="w-full" onClick={() => signIn("bitbucket")}>
              <Icons.bitbucket className="mr-2 size-4" />
              Sign in with Bitbucket
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  return {
    props: {},
  };
}
