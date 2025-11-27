import { Table } from "@components/Table";
import { IndustryBill } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Box, Typography, Card, Tooltip, Button } from "@mui/material";
import { useIndustryBills } from "@utils/hooks/queries";
import { formatDateTime } from "@utils/format";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";
import { IconBtn } from "@components/Button";
import { IndustryBillDialog } from "./IndustryBillDialog";
import { useState, useEffect, useMemo } from "react";
import { ReviewStatusLookup } from "@core/look-up/review-status";
import { useSearch } from "@utils/hooks/useSearch";
import { InputSearch, InputDate } from "@components/Input";
import { useRouter } from "next/router";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { BillStatusBadge } from "@components/ElectricBill/BillStatusBadge";
import { BillSourceTag } from "@components/ElectricBill/BillSourceTag";

interface IndustryBillPanelProps {
  month?: string;
  industryBillConfigId?: string;
  industryBillConfigName?: string;
}

const IndustryBillPanel = (props: IndustryBillPanelProps) => {
  const router = useRouter();
  const { setInputValue, searchTerm, executeSearch } = useSearch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [industryBill, setIndustryBill] = useState<IndustryBill | null>(null);
  const shouldSkipQuery = !props.month && !props.industryBillConfigId;
  const { data, loading, refetch } = useIndustryBills(
    {
      month: props.month,
      industryBillConfigId: props.industryBillConfigId,
      term: searchTerm,
    },
    { skip: shouldSkipQuery }
  );

  // Handle industryBillId query parameter
  useEffect(() => {
    const { industryBillId } = router.query;
    
    if (industryBillId && data?.industryBills?.list) {
      const targetIndustryBill = data.industryBills.list.find(
        (bill) => bill.id === industryBillId
      );
      
      if (targetIndustryBill) {
        setIndustryBill(targetIndustryBill);
        setIsOpenDialog(true);
      }
    }
  }, [router.query, data?.industryBills?.list]);

  const handleOpenDialog = (bill: IndustryBill) => {
    setIndustryBill(bill);
    setIsOpenDialog(true);
    
    // Update URL with industryBillId parameter
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, industryBillId: bill.id },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setIndustryBill(null);
    
    // Remove industryBillId from URL
    const { industryBillId, ...queryWithoutIndustryBillId } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: queryWithoutIndustryBillId,
      },
      undefined,
      { shallow: true }
    );
  };

  const configs: Config<IndustryBill>[] = [
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
    if (props.industryBillConfigName) {
      return `發電業電費單 ${props.industryBillConfigName}`;
    }

    if (props.month) {
      return `發電業電費單 ${formatDateTime(props.month, "yyyy-MM")}`;
    }
    
    return `發電業電費單`;
  }, [props.industryBillConfigName, props.month]);

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
          <InputSearch onChange={setInputValue} onEnter={executeSearch} />
          <Tooltip title="可使用電費單名稱搜尋">
            <InfoIcon />
          </Tooltip>
        </Box>

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
            list={data?.industryBills?.list}
            total={data?.industryBills?.total}
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
      {industryBill && (
        <IndustryBillDialog
          industryBill={industryBill}
          isOpenDialog={isOpenDialog}
          onClose={handleCloseDialog}
        />
      )}
    </ErrorBoundary>
  );
};

export default IndustryBillPanel;
