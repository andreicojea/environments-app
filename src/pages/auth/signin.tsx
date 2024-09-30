import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";

export default function SignIn() {
  // const { error } = useRouter().query;

  return (
    <>
      {/* {error && <p className="text-red-500">Error: {error}</p>} */}
      <div>-----</div>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <div>=====</div>
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
