import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import React from "react";

interface FormBoxProps {
  children: React.ReactNode;
}

const style = {
  container: [
    (theme: Theme) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "12px",
      maxWidth: "360px",
      m: "auto",
      marginTop: "24px",
      [theme.breakpoints.down("md")]: {
        p: "30px",
      },
    }),
  ],
};

const FormBox: React.FC<FormBoxProps> = ({ children }) => {
  return <Box sx={style.container}>{children}</Box>;
};

export default FormBox;
