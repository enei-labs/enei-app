import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const style = {
  container: [
    (theme: any) => ({
      position: "relative",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      height: "80px",
      backgroundSize: "contain",
      backgroundColor: theme.palette.tertiary.main,
      backgroundImage: 'url("/images/network.png")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right",
      [theme.breakpoints.down("md")]: {
        height: "60px",
      },
    }),
  ],
  wrapper: [
    (theme: any) => ({
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      px: "30px",
      [theme.breakpoints.down("md")]: {
        px: "20px",
      },
    }),
  ],
  logo: {
    display: "grid",
    gridTemplateColumns: "minmax(auto, 220px) max-content",
    alignItems: "center",
    gap: "20px",
  },
};

const Navbar = () => {
  return (
    <Box component="header" sx={style.container}>
      <Box sx={style.wrapper}>
        <Box sx={style.logo}>
          {/* <AegisDiligenceSvg /> */}
          <Chip variant="outlined" color="secondary" label="ADMIN" />
        </Box>

        {/** @TODO MENU */}
        {/* <MenuDesktop /> */}
      </Box>
    </Box>
  );
};

export default Navbar;
