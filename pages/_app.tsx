import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import { NextComponentType, NextPageContext } from "next";
import Layout from "../components/layout";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
