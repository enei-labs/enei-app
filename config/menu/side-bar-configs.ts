import BoltIcon from "@mui/icons-material/BoltOutlined";
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import UserIcon from "@mui/icons-material/PersonAddAlt";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export const sideBarConfigs = {
  top: [
    {
      name: "戰情總版",
      icon: FlagOutlinedIcon,
      path: '/main'
    },
    {
      name: "發電業管理",
      icon: BoltIcon,
      path: '/industry'
    },
    {
      name: "用戶管理",
      icon: UserIcon,
      path: '/user'
    },
    {
      name: "轉供申請進度",
      icon: ChartIcon,
      path: '/application'
    },
    {
      name: "轉供資料管理",
      icon: TaskOutlinedIcon,
      path: '/transfer'

    },
    {
      name: "電費單匯出",
      icon: InboxOutlinedIcon,
      path: '/electric-bill'
    },
    {
      name: "電費單匯入",
      icon: InboxOutlinedIcon,
      path: '/electric-bill/import'
    }
  ],
  down: [
    {
      name: "帳戶設定",
      icon: AccountCircleOutlinedIcon,
      path: '/settings'
    },
    {
      name: "修改密碼",
      icon: VpnKeyOutlinedIcon,
      path: '/reset-password'
    },
    {
      name: "權限管理",
      icon: LockOpenOutlinedIcon,
      path: '/permissions'
    },
    {
      name: "登出",
      icon: LogoutOutlinedIcon,
      path: '/logout'
    }
  ]
};
