import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Logo from "public/logo-with-name.svg";

interface ContainerProps {
  children?: React.ReactNode;
}

const style = {
  main: [
    (theme: Theme) => ({
      minHeight: "calc(100vh - 234px)",
      textAlign: "center",
      [theme.breakpoints.down("md")]: {
        minHeight: "calc(100vh - 171px)",
      },
    }),
  ],
  logo: [
    (theme: Theme) => ({
      display: "grid",
      gridTemplateColumns: "minmax(auto, 330px) max-content",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      m: "60px auto",
      [theme.breakpoints.down("md")]: {
        m: "30px auto",
      },
    }),
  ],
  footer: {
    display: "grid",
    gridTemplateColumns: "auto minmax(auto, 220px)",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    m: "30px",
  },
};

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <Box px="20px">
      <Box sx={style.logo}></Box>
      <Box component="main" sx={style.main}>
        {children}
      </Box>
    </Box>
  );
};

export default Container;
