import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";

const style = {
  logo: {
    display: "grid",
    gridTemplateColumns: "minmax(auto, 220px) max-content",
    alignItems: "center",
    gap: "20px",
  },
};

const drawerWidth = 240;

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar></Toolbar>
    </AppBar>
  );
};

export default Navbar;
