import { AppBar, Badge, IconButton } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
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
            <NotificationsOutlinedIcon />
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
          <AccountCircleOutlinedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
