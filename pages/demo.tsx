import * as React from "react";
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
import FlagIcon from "@mui/icons-material/Flag";
import UserIcon from "@mui/icons-material/PersonAddAlt";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import IconBreadcrumbs from "../components/BreadCrumbs";
import { Card, Grid } from "@mui/material";
import OverviewCard, { OverviewCardProps } from "../components/OverviewCard";

const drawerWidth = 240;

const configs = [
  {
    name: "戰情總版",
    icon: <FlagIcon />,
  },
  {
    name: "發電業管理",
    icon: <BoltIcon />,
  },
  {
    name: "用戶管理",
    icon: <UserIcon />,
  },
  {
    name: "轉供申請進度",
    icon: <ChartIcon />,
  },
  {
    name: "轉供資料管理",
    icon: <TaskOutlinedIcon />,
  },
  {
    name: "電費單匯出",
    icon: <MailIcon />,
  },
];

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
        <List>
          {configs.map((config, index) => (
            <ListItem key={config.name} disablePadding>
              <ListItemButton>
                <ListItemIcon>{config.icon ?? <InboxIcon />}</ListItemIcon>
                <ListItemText primary={config.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <IconBreadcrumbs config={[{ name: "戰情總版 " }]} />
        <Grid container spacing={4}>
          <Grid item sm={7}>
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
            <Card sx={{ p: { sm: "4rem" } }}>test3</Card>
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
