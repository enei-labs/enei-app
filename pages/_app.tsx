// import { ApolloProvider } from '@apollo/client'
// import Snackbar from '@components/Snackbar'
import theme from "@config/theme";
// import { AuthProvider } from '@core/context/auth'
// import client from '@core/graphql'
import { ThemeProvider } from "@mui/material";
import "@styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const component = getLayout(<Component {...pageProps} />);

  return (
    // <ApolloProvider client={client}>
    //   <AuthProvider>
    <ThemeProvider theme={theme}>{component}</ThemeProvider>
    //     <Snackbar />
    //   </AuthProvider>
    // </ApolloProvider>
  );
}

export default MyApp;
