// import { Box, Card, Divider, Grid, Typography } from "@mui/material";
// import { CompanyContract, UserContract } from "@core/graphql/types";
// import FlagIcon from "@mui/icons-material/OutlinedFlag";
// import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
// import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
// import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
// import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
// import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
// import MailIcon from "@mui/icons-material/MailOutlineOutlined";
// import PhoneIcon from "@mui/icons-material/PhoneOutlined";
// import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
// import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
// import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
// import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
// import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
// import { formatDateTime } from "@utils/format";
// import InfoBox from "../InfoBox";
// import { IconBtn } from "@components/Button";
// import DownloadDocBox from "@components/DownloadDocBox";
// import DemoChart from "@components/LineChart";
// import { useRemoveCompanyContract } from "@utils/hooks";
// import dynamic from "next/dynamic";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { InputSearch } from "@components/Input";
// import PowerPlantPanel from "@components/PowerPlant/PowerPlantPanel";
// import AddPowerPlantBtn from "@components/PowerPlant/AddPowerPlantBtn";
// import { useRouter } from "next/router";

// const DialogAlert = dynamic(() => import("@components/DialogAlert"));

// interface UserContractCardProps {
//   userContract: UserContract;
// }

// const styles = {
//   box: {
//     backgroundColor: "primary.light",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: "10px",
//     height: "172px",
//     marginTop: "10px",
//   },
// } as const;

// const userContractCardInfo = (userContract: UserContract) => {
//   const userContractInfo = [
//     {
//       icon: MonetizationOnOutlinedIcon,
//       label: "合約價格",
//       content: userContract.price,
//       unit: "元/kWh",
//     },
//     {
//       icon: EventOutlinedIcon,
//       label: "合約起始日期",
//       content: formatDateTime(userContract.startedAt),
//     },
//     {
//       icon: TrendingUpOutlinedIcon,
//       label: "轉供率要求",
//       content: userContract.transferRate,
//       unit: "%",
//     },
//     {
//       icon: TrendingUpOutlinedIcon,
//       label: "正式轉供日",
//       content: userContract.transferAt
//         ? formatDateTime(userContract.transferAt)
//         : "N/A",
//     },
//     {
//       icon: CreditCardOutlinedIcon,
//       label: "付款條件",
//       content: userContract.daysToPay,
//       unit: "天",
//     },
//     {
//       icon: TrendingUpOutlinedIcon,
//       label: "合約結束日期",
//       content: formatDateTime(userContract.endedAt),
//     },
//     {
//       icon: AccessTimeOutlinedIcon,
//       label: "合約年限",
//       content: userContract.duration,
//       unit: "年",
//     },
//   ];

//   const contactInfo = [
//     {
//       icon: PersonIcon,
//       label: "聯絡人",
//       content: userContract.,
//     },
//     {
//       icon: PhoneIcon,
//       label: "聯絡人電話",
//       content: userContract.contactPhone,
//     },
//     {
//       icon: MailIcon,
//       label: "聯絡人信箱",
//       content: userContract.contactEmail,
//     },
//   ];

//   return { userContractInfo, contactInfo };
// };

// function UserContractCard(props: UserContractCardProps) {
//   const { userContract } = props;
//   const router = useRouter();
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const degrees = 20;

//   const [removeUserContract] = useRemoveUserContract();
//   const { userContractInfo, contactInfo } = userContractCardInfo(userContract);

//   return (
//     <>
//       <Card sx={{ p: "36px" }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h4">{userContract.name}</Typography>
//           <Box sx={{ display: "flex" }}>
//             <IconBtn icon={<BorderColorOutlined />} onClick={() => {}} />
//             <IconBtn
//               icon={<DeleteOutlined />}
//               onClick={() => setOpenDeleteDialog(true)}
//             />
//           </Box>
//         </Box>
//         <Grid container sx={{ height: "264px" }}>
//           <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
//             <Box sx={{ display: "flex", columnGap: "12px" }}>
//               <FlagIcon width="20px" />
//               <Typography variant="body2">一年內待銷售度數</Typography>
//             </Box>
//             <Box sx={styles.box}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "flex-end",
//                   margin: "40px",
//                   columnGap: "4px",
//                 }}
//               >
//                 <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
//                   {degrees}
//                 </Typography>
//                 <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
//                   MWh/年
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>
//           <Grid
//             item
//             sm={4}
//             sx={{
//               padding: "36px",
//               borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
//               borderRight: "1px solid rgba(0, 0, 0, 0.12)",
//             }}
//           >
//             <Grid container>
//               {userContractInfo.map((c, index) => (
//                 <Grid item sm={6} key={`${c.label}-${index}`}>
//                   <InfoBox
//                     icon={c.icon}
//                     label={c.label}
//                     content={c.content}
//                     unit={c.unit}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//           </Grid>
//           <Grid item sm={4} sx={{ padding: "36px 0 36px 36px" }}>
//             <Grid container>
//               {contactInfo.map((c, index) => (
//                 <Grid item sm={12} key={`${c.label}-${index}`}>
//                   <InfoBox icon={c.icon} label={c.label} content={c.content} />
//                 </Grid>
//               ))}
//             </Grid>
//           </Grid>
//         </Grid>

//         <Divider sx={{ margin: "36px 0" }} />

//         <Box sx={{ display: "flex", height: "462px" }}>
//           <Box
//             sx={{
//               paddingRight: "36px",
//               borderRight: "1px solid rgba(0, 0, 0, 0.12)",
//               display: "flex",
//               flexDirection: "column",
//               rowGap: "6px",
//               width: "500px",
//             }}
//           >
//             <Box
//               sx={{ display: "flex", columnGap: "4px", marginBottom: "4px" }}
//             >
//               <FolderOutlinedIcon />
//               <Typography variant="body2">相關文件</Typography>
//             </Box>
//             <DownloadDocBox
//               fileId={userContract.contractDoc}
//               label="購電合約"
//             />
//             <DownloadDocBox
//               fileId={userContract.industryDoc}
//               label="電業佐證資料"
//             />
//             <DownloadDocBox
//               fileId={userContract.transferDoc}
//               label="轉供所需資料"
//             />
//           </Box>
//           <Box
//             sx={{
//               paddingLeft: "36px",
//               display: "flex",
//               flexDirection: "column",
//               rowGap: "6px",
//               width: "100%",
//             }}
//           >
//             <Box
//               sx={{ display: "flex", columnGap: "4px", marginBottom: "4px" }}
//             >
//               <ArticleOutlinedIcon />
//               <Typography variant="body2">合約描述 / 特殊條件</Typography>
//             </Box>
//             <Box
//               sx={{
//                 backgroundColor: "primary.light",
//                 borderRadius: "16px",
//                 width: "100%",
//                 height: "100%",
//               }}
//             >
//               {userContract.description}
//             </Box>
//           </Box>
//         </Box>

//         <Divider sx={{ margin: "36px 0 " }} />
//         <DemoChart name="月轉供量" />
//         <Divider sx={{ margin: "36px 0 " }} />

//         <Box>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               mb: "16px",
//             }}
//           >
//             <InputSearch />
//             <AddPowerPlantBtn userContractId={userContract.id} />
//           </Box>
//           <PowerPlantPanel />
//         </Box>
//       </Card>
//       {openDeleteDialog ? (
//         <DialogAlert
//           open={openDeleteDialog}
//           title={"刪除合約"}
//           content={"是否確認要刪除合約？"}
//           onConfirm={() => {
//             removeUserContract({
//               variables: { id: userContract.id },
//               onCompleted: () => {
//                 toast.success("刪除成功");
//                 setOpenDeleteDialog(false);
//                 router.push("/industry");
//               },
//             });
//           }}
//           onClose={() => setOpenDeleteDialog(false)}
//         />
//       ) : null}
//     </>
//   );
// }

// export default UserContractCard;
