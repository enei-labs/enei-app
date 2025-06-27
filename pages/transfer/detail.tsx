import { ReactElement, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { 
  Box, 
  Card, 
  Typography, 
  Divider, 
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert
} from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { AuthGuard } from "@components/AuthGuard";
import { Role } from "@core/graphql/types";
import IconBreadcrumbs from "@components/BreadCrumbs";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { useTPCBill } from "@utils/hooks/queries";
import { formatDateTime } from "@utils/format";
import { IconBtn } from "@components/Button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { handleDownload } from "@utils/download";
import { toast } from "react-toastify";

function TPCBillDetailPage() {
  const router = useRouter();
  const { tpcBillId } = router.query;
  
  const { data, loading, error } = useTPCBill(tpcBillId as string);
  const tpcBill = data?.tpcBill;

  if (loading) {
    return (
      <>
        <Head>
          <title>台電代輸繳費單詳細資訊</title>
          <meta name="description" content="台電代輸繳費單詳細資訊" />
        </Head>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error || !tpcBill) {
    return (
      <>
        <Head>
          <title>台電代輸繳費單詳細資訊</title>
          <meta name="description" content="台電代輸繳費單詳細資訊" />
        </Head>
        <Box sx={{ padding: 3 }}>
          <Alert severity="error">
            {error ? "載入資料時發生錯誤" : "找不到該台電代輸繳費單"}
          </Alert>
        </Box>
      </>
    );
  }

  // 計算轉供度數總計
  const totalDegree = tpcBill.transferDegrees?.reduce((sum, transfer) => sum + (transfer.degree || 0), 0) || 0;

  // 獲取關聯用戶列表
  const relatedUsers = tpcBill.transferDegrees?.map(transfer => transfer.user).filter(Boolean) || [];
  const uniqueUsers = Array.from(new Map(relatedUsers.map(user => [user?.id, user])).values());

  // 獲取關聯電廠列表
  const relatedPowerPlants = tpcBill.transferDegrees?.map(transfer => transfer.powerPlant).filter(Boolean) || [];
  const uniquePowerPlants = Array.from(new Map(relatedPowerPlants.map(plant => [plant?.id, plant])).values());

  return (
    <>
      <Head>
        <title>台電代輸繳費單詳細資訊</title>
        <meta name="description" content="台電代輸繳費單詳細資訊" />
      </Head>
      
      <IconBreadcrumbs
        items={[
          {
            name: "轉供資料管理",
            icon: TaskOutlinedIcon,
            href: "/transfer",
          },
          {
            name: "台電代輸繳費單詳細資訊",
            icon: ReceiptOutlinedIcon,
            href: `/transfer/detail?tpcBillId=${tpcBillId}`,
          },
        ]}
      />

      <Box sx={{ paddingTop: "12px" }}>
        <AuthGuard roles={[Role.Admin, Role.SuperAdmin]}>
          {/* 基本資訊區塊 */}
          <Card sx={{ p: "36px", mb: "24px" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              台電代輸繳費單基本資訊
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    繳費單編號
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {tpcBill.billNumber || "未設定"}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    收到日期
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {formatDateTime(tpcBill.billReceivedDate)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    開立日期
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {formatDateTime(tpcBill.billingDate)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    轉供度數總計
                  </Typography>
                  <Chip 
                    label={`${totalDegree.toLocaleString()} 度`}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    繳費單文件
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {tpcBill.billDoc ? (
                      <IconBtn
                        icon={<FileDownloadOutlinedIcon />}
                        onClick={() => handleDownload(tpcBill.billDoc)}
                        tooltipText="下載繳費單"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        無文件
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>

          <Divider sx={{ my: "24px" }} />

          {/* 關聯用戶列表 */}
          <Card sx={{ p: "36px", mb: "24px" }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              關聯用戶列表 ({uniqueUsers.length} 個用戶)
            </Typography>
            
            {uniqueUsers.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>用戶姓名</TableCell>
                      <TableCell>轉供度數</TableCell>
                      <TableCell>建立時間</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tpcBill.transferDegrees?.map((transfer, index) => 
                      transfer.user ? (
                        <TableRow key={`${transfer.user.id}-${index}`}>
                          <TableCell>
                            <Typography variant="body2">
                              {transfer.user.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${(transfer.degree || 0).toLocaleString()} 度`}
                              color="info"
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDateTime(transfer.createdAt)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : null
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                此繳費單尚未關聯任何用戶
              </Alert>
            )}
          </Card>

          <Divider sx={{ my: "24px" }} />

          {/* 關聯電廠列表 */}
          <Card sx={{ p: "36px" }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              關聯電廠列表 ({uniquePowerPlants.length} 個電廠)
            </Typography>
            
            {uniquePowerPlants.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>電廠名稱</TableCell>
                      <TableCell>轉供度數</TableCell>
                      <TableCell>建立時間</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tpcBill.transferDegrees?.map((transfer, index) => 
                      transfer.powerPlant ? (
                        <TableRow key={`${transfer.powerPlant.id}-${index}`}>
                          <TableCell>
                            <Typography variant="body2">
                              {transfer.powerPlant.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${(transfer.degree || 0).toLocaleString()} 度`}
                              color="success"
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDateTime(transfer.createdAt)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : null
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                此繳費單尚未關聯任何電廠
              </Alert>
            )}
          </Card>
        </AuthGuard>
      </Box>
    </>
  );
}

TPCBillDetailPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default TPCBillDetailPage;