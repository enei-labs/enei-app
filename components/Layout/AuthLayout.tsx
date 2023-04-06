import { useAuth } from "@core/context/auth";
import { Divider, Drawer, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Logo from "public/logo-with-name.svg";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const style = {
  container: [
    (theme: Theme) => ({
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "auto",
      },
    }),
  ],
  main: [
    (theme: Theme) => ({
      display: "flex",
      flexDirection: "column",
      minHeight: "calc(100vh - 194px)",
      overflow: "scroll",
      padding: "36px",
      [theme.breakpoints.down("md")]: {
        minHeight: "calc(100vh - 174px)",
      },
    }),
  ],
  footer: [
    (theme: Theme) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      m: "30px",
      [theme.breakpoints.down("md")]: {
        justifyContent: "center",
      },
    }),
  ],
  text: [
    (theme: Theme) => ({
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    }),
  ],
  logo: [
    (theme: Theme) => ({
      display: "grid",
      gridTemplateColumns: "auto minmax(auto, 190px)",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "10px",
      width: "100%",
      [theme.breakpoints.down("md")]: {
        justifyContent: "center",
      },
    }),
  ],
};

const drawerWidth = 240;

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/logIn");
  }, [router, status]);

  if (status === "loading" || status === "unauthenticated") {
    return <></>;
  }

  return (
    <>
      <Navbar />

      <Box sx={style.container}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box
            sx={{
              height: 100,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingX: "25px",
              cursor: 'pointer',
            }}
            onClick={() => router.push('/main')}
          >
            <Logo height="40" />
          </Box>
          <Sidebar />
        </Drawer>
        <Box component="main" sx={style.main}>
          <Toolbar />
          {children}
        </Box>
      </Box>

      <Box component="footer" sx={style.footer}>
        <Typography color="primary" sx={style.text}>
          {process.env.NEXT_PUBLIC_VERSION}
        </Typography>

        <Box sx={style.logo}>
          <Typography color="primary">Powered by</Typography>
          <Logo height="40" />
        </Box>
      </Box>
    </>
  );
};

export default AuthLayout;
