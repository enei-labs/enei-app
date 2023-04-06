import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import dynamic from "next/dynamic";

const LoginForgotPwdDialog = dynamic(() => import("./LoginForgotPwdDialog"));

const styles = {
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: [
    (theme: any) => ({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      columnGap: "8px",
      color: theme.palette.primary.main,
      border: "none",
      "&:hover": {
        border: 'none',
      }
    }),
  ],
};

const LogInForgotPwdBtn = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={styles.box}>
      <Button
        disableRipple
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={styles.btn}
      >
        <HelpOutlineIcon />
        <span>忘記密碼?</span>
      </Button>
      {open ? (
        <LoginForgotPwdDialog open={open} onClose={() => setOpen(false)} />
      ) : null}
    </Box>
  );
};

export default LogInForgotPwdBtn;
