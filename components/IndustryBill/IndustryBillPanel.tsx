import { Table } from "@components/Table";
import { IndustryBill } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Box, Typography, Card } from "@mui/material";
import { useIndustryBills } from "@utils/hooks/queries";
import { formatDateTime } from "@utils/format";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { IconBtn } from "@components/Button";
import { IndustryBillDialog } from "./IndustryBillDialog";
import { useState } from "react";
import { ReviewStatusLookup } from "@core/look-up/review-status";

interface IndustryBillPanelProps {
  month: string;
}

const IndustryBillPanel = (props: IndustryBillPanelProps) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [industryBill, setIndustryBill] = useState<IndustryBill | null>(null);
  const { data, loading, refetch } = useIndustryBills({
    month: props.month,
  });

  const configs: Config<IndustryBill>[] = [
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
          onClick={() => {
            setIndustryBill(data);
            setIsOpenDialog(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Card sx={{ mt: "36px", p: "36px" }}>
        <Typography variant="h4">{`發電業電費單 - ${formatDateTime(
          props.month,
          "yyyy-MM"
        )}`}</Typography>
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
      </Card>
      {industryBill && (
        <IndustryBillDialog
          industryBill={industryBill}
          isOpenDialog={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
        />
      )}
    </>
  );
};

export default IndustryBillPanel;
