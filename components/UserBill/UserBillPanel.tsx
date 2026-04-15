import { Table } from "@components/Table";
import { UserBill, ElectricBillStatus, BillSource } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Box, Typography, Card, Tooltip, Button } from "@mui/material";
import { useUserBills, useUserBill } from "@utils/hooks/queries";
import { formatDateTime } from "@utils/format";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import { IconBtn } from "@components/Button";
import { UserBillDialog } from "./UserBillDialog";
import { UserBillEmailModal } from "./UserBillEmailModal";
import { useState, useEffect, useMemo } from "react";
import { useSearch } from "@utils/hooks/useSearch";
import {
  useUrlArrayParam,
  useClearUrlParams,
} from "@utils/hooks/useUrlArrayParam";
import { useUrlDialogSync } from "@utils/hooks/useUrlDialogSync";
import { InputSearch, InputDate } from "@components/Input";
import { useRouter } from "next/router";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { BillStatusBadge } from "@components/ElectricBill/BillStatusBadge";
import { BillSourceTag } from "@components/ElectricBill/BillSourceTag";
import { BillFilters } from "@components/ElectricBill/BillFilters";

interface UserBillPanelProps {
  month?: string;
  userBillConfigId?: string;
  userBillConfigName?: string;
}

const UserBillPanel = (props: UserBillPanelProps) => {
  const router = useRouter();
  const { setInputValue, searchTerm, executeSearch, initialSearchTerm } =
    useSearch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [userBill, setUserBill] = useState<UserBill | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const shouldSkipQuery = !props.month && !props.userBillConfigId;

  const [statusesFromUrl, setStatuses] = useUrlArrayParam<ElectricBillStatus>(
    "statuses",
    Object.values(ElectricBillStatus)
  );
  const [billSourcesFromUrl, setBillSources] = useUrlArrayParam<BillSource>(
    "billSources",
    Object.values(BillSource)
  );
  const clearUrlParams = useClearUrlParams();
  const {
    id: userBillIdFromUrl,
    open: openUserBillFromUrl,
    close: closeUserBillFromUrl,
  } = useUrlDialogSync("userBillId");

  const { data, loading, refetch } = useUserBills(
    {
      month: props.month,
      userBillConfigId: props.userBillConfigId,
      term: searchTerm,
      statuses: statusesFromUrl.length > 0 ? statusesFromUrl : undefined,
      billSources: billSourcesFromUrl.length > 0 ? billSourcesFromUrl : undefined,
    },
    { skip: shouldSkipQuery }
  );

  // 當 URL 有 userBillId 時，直接查詢該筆電費單
  const { data: singleBillData } = useUserBill(userBillIdFromUrl || "");

  // Handle userBillId query parameter - 自動打開 dialog
  // 注意：不要把 isOpenDialog 放在 dependency array，否則關閉時會因為 URL 還沒更新而重新打開
  useEffect(() => {
    if (userBillIdFromUrl && singleBillData?.userBill) {
      setUserBill(singleBillData.userBill as UserBill);
      setIsOpenDialog(true);
    }
  }, [userBillIdFromUrl, singleBillData?.userBill]);

  const handleOpenDialog = (bill: UserBill) => {
    setUserBill(bill);
    setIsOpenDialog(true);
    openUserBillFromUrl(bill.id);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setUserBill(null);
    closeUserBillFromUrl();
  };

  const configs: Config<UserBill>[] = [
    {
      header: "電費單名稱",
      accessor: "name",
      render: (rowData) => <Box>{rowData.name}</Box>,
    },
    {
      header: "狀態",
      accessor: "status",
      render: (rowData) => (
        <BillStatusBadge
          status={rowData.status}
          billSource={rowData.billSource as any}
        />
      ),
    },
    {
      header: "來源",
      accessor: "billSource",
      render: (rowData) => (
        <BillSourceTag billSource={rowData.billSource as any} />
      ),
    },
    {
      header: "原始檔案",
      accessor: "originalFileDownloadUrl",
      render: (rowData) => (
        rowData.originalFileDownloadUrl ? (
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={(e) => {
              e.stopPropagation();
              window.open(rowData.originalFileDownloadUrl!, '_blank');
            }}
          >
            下載
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">-</Typography>
        )
      ),
    },
    {
      header: "檢視 / 審核",
      render: (data) => (
        <IconBtn
          icon={<EventNoteOutlinedIcon />}
          onClick={() => handleOpenDialog(data)}
        />
      ),
    },
  ];

  const title = useMemo(() => {
    if (props.userBillConfigName) {
      return `用戶電費單 - ${props.userBillConfigName}`;
    }

    if (props.month) {
      return `用戶電費單 - ${formatDateTime(props.month, "yyyy-MM")}`;
    }

    return `用戶電費單`;
  }, [props.userBillConfigName, props.month]);

  // 從後端取得的狀態統計
  const approvedCount = data?.userBills?.statusCounts?.approvedCount || 0;

  return (
    <ErrorBoundary>
      <Card sx={{ mt: "36px", p: "36px" }}>
        <Typography variant="h4" sx={{ mb: "16px" }}>{title}</Typography>
        
        {/* 月份選擇與搜尋 */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px", mb: "16px" }}>
          <Box sx={{ width: 180, mr: "16px" }}>
            <InputDate
              label="選擇月份"
              value={props.month}
              openTo="month"
              views={["year", "month"]}
              onChange={(newValue) => {
                if (newValue) {
                  const dateObj = new Date(newValue);
                  const year = dateObj.getFullYear();
                  const monthNum = dateObj.getMonth() + 1;
                  const formatted = `${year}-${monthNum.toString().padStart(2, "0")}`;
                  router.push({
                    pathname: router.pathname,
                    query: { ...router.query, month: formatted },
                  });
                }
              }}
            />
          </Box>
          <InputSearch
            onChange={setInputValue}
            onEnter={executeSearch}
            defaultValue={initialSearchTerm}
          />
          <Tooltip title="可使用電費單名稱搜尋">
            <InfoIcon />
          </Tooltip>
        </Box>

        {/* Filter 篩選 */}
        {!shouldSkipQuery && (
          <Box sx={{ mb: 2 }}>
            <BillFilters
              statuses={statusesFromUrl}
              billSources={billSourcesFromUrl}
              onStatusChange={setStatuses}
              onBillSourceChange={setBillSources}
              onClear={() => clearUrlParams(["statuses", "billSources"])}
            />
          </Box>
        )}

        {/* 操作區域 - 只在有電費單時顯示 */}
        {!shouldSkipQuery && data?.userBills?.list && data.userBills.list.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              p: 2,
              backgroundColor: "grey.50",
              borderRadius: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                共 {data.userBills.total} 筆電費單，已審核 {approvedCount} 筆
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={() => setEmailModalOpen(true)}
            >
              寄送電費單
            </Button>
          </Box>
        )}

        {shouldSkipQuery ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: "64px",
              color: "text.secondary",
            }}
          >
            <Typography>請選擇月份以查看電費單</Typography>
          </Box>
        ) : (
          <Table
            configs={configs}
            list={data?.userBills?.list}
            total={data?.userBills?.total}
            loading={loading}
            onPageChange={(page) => {
              refetch({
                limit: page.rows,
                offset: page.rows * page.index,
              });
            }}
          />
        )}
      </Card>
      {userBill && (
        <UserBillDialog
          userBill={userBill}
          isOpenDialog={isOpenDialog}
          onClose={handleCloseDialog}
        />
      )}
      {emailModalOpen && (
        <UserBillEmailModal
          open={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          month={props.month || ""}
          bills={data?.userBills?.list || []}
          statusCounts={data?.userBills?.statusCounts}
        />
      )}
    </ErrorBoundary>
  );
};

export default UserBillPanel;
