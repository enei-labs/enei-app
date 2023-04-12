import { AuthLayout } from "@components/Layout";
import Head from "next/head";
import { ReactElement } from "react";

const Home = () => {
  return (
    <>
      <Head>
        <title>Anneal Energy ERP System</title>
        <meta name="description" content="Anneal Energy ERP System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Home;
