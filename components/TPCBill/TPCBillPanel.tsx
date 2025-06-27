import { Table } from "@components/Table";
import { TpcBill, TpcBillPage } from "@core/graphql/types";
import { Config, Page } from "../Table/Table";
import { Box, Chip, Typography } from "@mui/material";
import { formatDateTime } from "@utils/format";
import { handleDownload } from "@utils/download";
import { IconBtn } from "@components/Button";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useRemoveTPCBill } from "@utils/hooks";
import { useRouter } from "next/router";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));
const TPCBillDialog = dynamic(
  () => import("@components/TPCBill/TPCBillDialog/TPCBillDialog"),
  { ssr: false }
);

interface TPCBillPanelProps {
  tpcBillPage?: TpcBillPage;
  loading?: boolean;
  refetchFn: (page: Page) => void;
}

const TPCBillPanel = (props: TPCBillPanelProps) => {
  const { tpcBillPage, loading = false, refetchFn } = props;
  const router = useRouter();
  const [removeTPCBill] = useRemoveTPCBill();
  const [currentTPCBill, setCurrentTPCBill] = useState<TpcBill | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // 計算轉供度數總計
  const calculateTotalDegree = (tpcBill: TpcBill) => {
    return tpcBill.transferDegrees?.reduce((sum, transfer) => sum + (transfer.degree || 0), 0) || 0;
  };

  // 計算關聯用戶數量
  const getUniqueUsersCount = (tpcBill: TpcBill) => {
    const uniqueUserIds = new Set(tpcBill.transferDegrees?.map(transfer => transfer.user?.id).filter(Boolean));
    return uniqueUserIds.size;
  };

  // 計算關聯電廠數量
  const getUniquePowerPlantsCount = (tpcBill: TpcBill) => {
    const uniquePlantIds = new Set(tpcBill.transferDegrees?.map(transfer => transfer.powerPlant?.id).filter(Boolean));
    return uniquePlantIds.size;
  };

  const configs: Config<TpcBill>[] = [
    {
      header: "繳費單編號",
      accessor: "billNumber",
      render: (rowData) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => router.push(`/transfer/detail?tpcBillId=${rowData.id}`)}
        >
          {rowData.billNumber || "未設定"}
        </Box>
      ),
    },
    {
      header: "收到日期",
      accessor: "billReceivedDate",
      render: (rowData) => (
        <Box>{formatDateTime(rowData.billReceivedDate)}</Box>
      ),
    },
    {
      header: "開立日期", 
      accessor: "billingDate",
      render: (rowData) => (
        <Box>{formatDateTime(rowData.billingDate)}</Box>
      ),
    },
    {
      header: "轉供度數總計",
      accessor: "",
      render: (rowData) => {
        const totalDegree = calculateTotalDegree(rowData);
        return (
          <Box>
            {totalDegree.toLocaleString()} 度
          </Box>
        );
      },
    },
    {
      header: "關聯用戶數",
      accessor: "",
      render: (rowData) => {
        const userCount = getUniqueUsersCount(rowData);
        return (
          <Box>
            {userCount} 個
          </Box>
        );
      },
    },
    {
      header: "關聯電廠數",
      accessor: "",
      render: (rowData) => {
        const plantCount = getUniquePowerPlantsCount(rowData);
        return (
          <Box>
            {plantCount} 個
          </Box>
        );
      },
    },
    {
      header: "操作",
      accessor: "",
      render: (rowData) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* 下載繳費單 */}
          <IconBtn
            icon={<FileDownloadOutlinedIcon />}
            onClick={() => {
              if (rowData.billDoc) {
                handleDownload(rowData.billDoc);
              } else {
                toast.warning("無繳費單文件可下載");
              }
            }}
          />
          
          {/* 查看詳情 */}
          <IconBtn
            icon={<VisibilityOutlinedIcon />}
            onClick={() => {
              router.push(`/transfer/detail?tpcBillId=${rowData.id}`);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            icon={<DeleteOutlined />}
            onClick={() => {
              setCurrentTPCBill(rowData);
              setOpenDeleteDialog(true);
            }}
          />
        </Box>
      ),
    },
  ];

  return (
    <>
      <Table
        configs={configs}
        list={tpcBillPage?.list}
        total={tpcBillPage?.total}
        loading={loading}
        onPageChange={refetchFn}
      />
      
      {/* 刪除確認對話框 */}
      {openDeleteDialog && currentTPCBill ? (
        <DialogAlert
          open={openDeleteDialog}
          title="刪除台電代輸繳費單"
          content={`是否確認要刪除繳費單編號「${currentTPCBill.billNumber}」？`}
          onConfirm={() => {
            removeTPCBill({
              variables: { id: currentTPCBill.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setOpenDeleteDialog(false);
                setCurrentTPCBill(null);
                refetchFn({ index: 0, rows: 10 });
              },
              onError: (error) => {
                toast.error(`刪除失敗：${error.message}`);
              },
            });
          }}
          onClose={() => {
            setOpenDeleteDialog(false);
            setCurrentTPCBill(null);
          }}
        />
      ) : null}

    </>
  );
};

export default TPCBillPanel;