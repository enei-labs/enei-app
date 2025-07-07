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
import "@styles/nprogress.css";
import { useNProgress } from "@utils/hooks/useNProgress";
import { ErrorBoundary } from "@components/ErrorBoundary";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  console.log("Current Commit Hash:", process.env.NEXT_PUBLIC_COMMIT_HASH);
  console.log("Build Time:", process.env.NEXT_PUBLIC_BUILD_TIME);
  
  const getLayout = Component.getLayout ?? ((page) => page);
  const component = getLayout(<Component {...pageProps} />);

  // 使用自定義的 NProgress Hook
  useNProgress({
    minimum: 0.3,
    speed: 500,
    showSpinner: false,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ErrorBoundary>
            <ThemeProvider theme={theme}>{component}</ThemeProvider>
          </ErrorBoundary>
          <Snackbar />
        </AuthProvider>
      </ApolloProvider>
    </LocalizationProvider>
  );
}

export default MyApp;
