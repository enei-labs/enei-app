import { AuthLayout } from "@components/Layout";
import Head from "next/head";
import { ReactElement } from "react";

const Home = () => {
  return (
    <>
      <Head>
        <title>Enei ERP System</title>
        <meta name="description" content="Enei ERP System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Home;
