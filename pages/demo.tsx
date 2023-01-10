import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import UserIcon from "@mui/icons-material/PersonAddAlt";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import IconBreadcrumbs from "../components/BreadCrumbs";
import { Card, Grid } from "@mui/material";
import OverviewCard, { OverviewCardProps } from "../components/OverviewCard";
import Sidebar from "../components/Layout/Sidebar";
import AnnualPrice from "../components/AnnualPrice";

const drawerWidth = 240;

const industryOverview: OverviewCardProps = {
  topic: "發電業資訊",
  basicInfos: [
    {
      icon: BoltIcon,
      name: "發電業數量",
      count: 47,
      unit: "家",
    },
    {
      icon: MailIcon,
      name: "總裝置量",
      count: 796885,
      unit: "MW",
    },
    {
      icon: BoltIcon,
      name: "平均每kW發電度數",
      count: 1300,
      unit: "kWh",
    },
  ],
};

const userOverview = {
  topic: "用戶資訊",
  basicInfos: [
    {
      icon: BoltIcon,
      name: "用戶數量",
      count: 50,
      unit: "位",
    },
    {
      icon: BoltIcon,
      name: "年度用戶成長數",
      count: 10,
      unit: "位",
    },
    {
      icon: BoltIcon,
      name: "售出總度數",
      count: 796885,
      unit: "MW",
    },
  ],
};

export default function PermanentDrawerLeft() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, alignSelf: "flex-end" }}
          >
            Enei-Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
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
        <Box>Logo</Box>
        <Toolbar />
        <Divider />
        <Sidebar />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <IconBreadcrumbs
          items={[
            {
              name: "戰情總版",
              icon: OutlinedFlagIcon,
              href: "/",
            },
            {
              name: "發電業管理",
              icon: BoltIcon,
              href: "/industry",
            },
          ]}
        />
        <Grid container spacing={4} marginTop="4px">
          <Grid item sm={7} height="100%">
            <Grid container spacing={4}>
              <Grid item sm={12}>
                <OverviewCard {...industryOverview} />
              </Grid>
              <Grid item sm={12}>
                <OverviewCard {...userOverview} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={5}>
            <Card sx={{ p: { sm: "4rem" } }}>
              <AnnualPrice annualBuyPrice="5022" annualSellPrice="4022" />
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ p: { sm: "4rem" } }}>test4</Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ p: { sm: "4rem" } }}>test5</Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
