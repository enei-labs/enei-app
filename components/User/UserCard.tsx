import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import { User } from "@core/graphql/types";
import FlagIcon from "@mui/icons-material/OutlinedFlag";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MailIcon from "@mui/icons-material/MailOutlineOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import InfoBox from "../InfoBox";
import { IconBtn } from "@components/Button";
import DemoChart from "@components/LineChart";
import { useRemoveUser } from "@utils/hooks";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "react-toastify";
import { InputSearch } from "@components/Input";
import { useRouter } from "next/router";
import UserContractPanel from "@components/UserContract/UserContractPanel";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface UserCardProps {
  user: User;
}

const styles = {
  box: {
    backgroundColor: "primary.light",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    height: "172px",
    marginTop: "10px",
  },
} as const;

const userCardInfo = (user: User) => {
  return [
    {
      icon: PersonIcon,
      label: "聯絡人",
      content: user.contactName,
    },
    {
      icon: PhoneIcon,
      label: "聯絡人電話",
      content: user.contactPhone,
    },
    {
      icon: MailIcon,
      label: "聯絡人信箱",
      content: user.contactEmail,
    },
    {
      icon: HomeOutlinedIcon,
      label: "總公司地址",
      content: user.companyAddress,
    },
  ];
};

function UserCard(props: UserCardProps) {
  const { user } = props;
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const degrees = 20;

  const [removeUser] = useRemoveUser();
  const cardInfo = userCardInfo(user);

  return (
    <>
      <Card sx={{ p: "36px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">{user.name}</Typography>
          <Box sx={{ display: "flex" }}>
            {/* <EditCompanyContractBtn companyContract={user} /> */}
            <IconBtn
              icon={<DeleteOutlined />}
              onClick={() => setOpenDeleteDialog(true)}
            />
          </Box>
        </Box>

        {/* 總覽區 */}
        <Grid container>
          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <FlagIcon width="20px" />
              <Typography variant="body2">用戶預計年採購度數</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {degrees}
                </Typography>
                <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                  MWh/年
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <FlagIcon width="20px" />
              <Typography variant="body2">預估本年度可能採購度數</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {degrees}
                </Typography>
                <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                  MWh/年
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <FlagIcon width="20px" />
              <Typography variant="body2">用戶今年累積總度數</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {degrees}
                </Typography>
                <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                  MWh/年
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Divider sx={{ margin: "36px 0" }} />

          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <FlagIcon width="20px" />
              <Typography variant="body2">用戶提醒</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {degrees}
                </Typography>
                <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                  MWh/年
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item sm={4} sx={{ padding: "36px 0 36px 36px" }}>
            <Grid container>
              {cardInfo.map((c, index) => (
                <Grid item sm={12} key={`${c.label}-${index}`}>
                  <InfoBox icon={c.icon} label={c.label} content={c.content} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <FlagIcon width="20px" />
              <Typography variant="body2">用戶付款帳號</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {degrees}
                </Typography>
                <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                  MWh/年
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ margin: "36px 0 " }} />
        <DemoChart name="月轉供量" />
        <Divider sx={{ margin: "36px 0 " }} />

        <UserContractPanel user={user} />
      </Card>
      {openDeleteDialog ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除合約"}
          content={"是否確認要刪除合約？"}
          onConfirm={() => {
            removeUser({
              variables: { id: user.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setOpenDeleteDialog(false);
                router.push("/user");
              },
            });
          }}
          onClose={() => setOpenDeleteDialog(false)}
        />
      ) : null}
    </>
  );
}

export default UserCard;
