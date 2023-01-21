import Link from "@components/Link";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { sideBarConfigs } from "@config/menu/side-bar-configs";

const style = {
  container: [
    (theme: Theme) => ({
      display: "flex",
      flexDirection: "column",
      padding: "8px",
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    }),
  ],
  wrapper: [
    (theme: Theme) => ({
      display: "flex",
      justifyContent: "center",
      columnGap: "10px",
      padding: "12px 18px",
      "& .MuiTypography-root": {
        width: "100%",
        color: theme.palette.text.primary,
      },
      "&:hover .MuiTypography-root": {
        color: theme.palette.primary.main,
      },
      "&.active .MuiTypography-root": {
        color: theme.palette.primary.main,
      },
    }),
  ],
};

const Sidebar = () => {
  const router = useRouter();

  return (
    <Box sx={style.container}>
      {sideBarConfigs.map((item, index) => {
        const { name, path = "", icon: Icon } = item;
        const isActive = router.pathname === path;

        return (
          <Link key={index} href={path}>
            <Box sx={style.wrapper} className={isActive ? "active" : undefined}>
              <Icon />
              <Typography variant="menuItem">{name}</Typography>
            </Box>
          </Link>
        );
      })}
    </Box>
  );
};

export default Sidebar;
