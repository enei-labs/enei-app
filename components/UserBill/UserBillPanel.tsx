import { Table } from "@components/Table";
import { UserBill } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Box, Typography, Card, Tooltip } from "@mui/material";
import { useUserBills } from "@utils/hooks/queries";
import { formatDateTime } from "@utils/format";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import InfoIcon from "@mui/icons-material/Info";
import { IconBtn } from "@components/Button";
import { UserBillDialog } from "./UserBillDialog";
import { useState, useEffect, useMemo } from "react";
import { ReviewStatusLookup } from "@core/look-up/review-status";
import { useSearch } from "@utils/hooks/useSearch";
import { InputSearch } from "@components/Input";
import { useRouter } from "next/router";

interface UserBillPanelProps {
  month?: string;
  userBillConfigId?: string;
  userBillConfigName?: string;
}

const UserBillPanel = (props: UserBillPanelProps) => {
  const router = useRouter();
  const { setInputValue, searchTerm, executeSearch } = useSearch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [userBill, setUserBill] = useState<UserBill | null>(null);
  const { data, loading, refetch } = useUserBills({
    month: props.month,
    userBillConfigId: props.userBillConfigId,
    term: searchTerm,
  });

  // Handle userBillId query parameter
  useEffect(() => {
    const { userBillId } = router.query;
    
    if (userBillId && data?.userBills?.list) {
      const targetUserBill = data.userBills.list.find(
        (bill) => bill.id === userBillId
      );
      
      if (targetUserBill) {
        setUserBill(targetUserBill);
        setIsOpenDialog(true);
      }
    }
  }, [router.query, data?.userBills?.list]);

  const handleOpenDialog = (bill: UserBill) => {
    setUserBill(bill);
    setIsOpenDialog(true);
    
    // Update URL with userBillId parameter
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, userBillId: bill.id },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setUserBill(null);
    
    // Remove userBillId from URL
    const { userBillId, ...queryWithoutUserBillId } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: queryWithoutUserBillId,
      },
      undefined,
      { shallow: true }
    );
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
      render: (rowData) => <Box>{ReviewStatusLookup[rowData.status]}</Box>,
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

  return (
    <>
      <Card sx={{ mt: "36px", p: "36px" }}>
        <Typography variant="h4" sx={{ mb: "16px" }}>{title}</Typography>
        
        {/* 搜尋 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
          <InputSearch onChange={setInputValue} onEnter={executeSearch} />
          <Tooltip title="可使用電費單名稱搜尋">
            <InfoIcon />
          </Tooltip>
        </Box>

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
      </Card>
      {userBill && (
        <UserBillDialog
          userBill={userBill}
          isOpenDialog={isOpenDialog}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};

export default UserBillPanel;
