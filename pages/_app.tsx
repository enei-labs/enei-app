import { ApolloProvider } from "@apollo/client";
import Router from "next/router";
import theme from "@config/theme";
import { AuthProvider } from "@core/context/auth";
import client from "@core/graphql";
import { ThemeProvider } from "@mui/material";
import "@styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Snackbar from "@components/Snackbar";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const component = getLayout(<Component {...pageProps} />);

  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ThemeProvider theme={theme}>{component}</ThemeProvider>
          <Snackbar />
        </AuthProvider>
      </ApolloProvider>
    </LocalizationProvider>
  );
}

export default MyApp;
