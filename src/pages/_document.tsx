import { GeistSans } from "geist/font/sans";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Environments App</title>
        <link rel="icon" href="/favicon.ico" />{" "}
        <meta
          name="description"
          content="Frictionless deployment for lower environments at Mosaic"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={GeistSans.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
