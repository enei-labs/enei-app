import MailIcon from "@mui/icons-material/Mail";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import UserIcon from "@mui/icons-material/PersonAddAlt";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";

export const sideBarConfigs = [
  {
    name: "戰情總版",
    icon: FlagIcon,
    path: '/'
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
    path: '/transform'

  },
  {
    name: "電費單匯出",
    icon: MailIcon,
    path: '/export'
  },
];
