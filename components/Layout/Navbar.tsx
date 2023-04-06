import { AppBar, Badge, IconButton } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useRouter } from "next/router";

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
  const router = useRouter();

  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          onClick={() => router.push('/settings')}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
