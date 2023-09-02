import { IconBtn } from "@components/Button";
import Table, { Config } from "@components/Table/Table";
import { TpcBill, TpcBillPage } from "@core/graphql/types";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useTpcBills } from "@utils/hooks/queries";
import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useRemoveTPCBill } from "@utils/hooks";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { formatDateTime } from "@utils/format";
import { handleDownload } from "@utils/download";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface TPCPanelProps {
  transferDocumentId: string;
  tpcBillPage?: TpcBillPage;
  loading: boolean;
}

const TPCPanel = (props: TPCPanelProps) => {
  const { tpcBillPage, loading, transferDocumentId } = props;
  const router = useRouter();
  const { refetch } = useTpcBills({ transferDocumentId });
  const [removeTPCBill] = useRemoveTPCBill();
  const [currentTPCBill, setCurrentTPCBill] = useState<TpcBill | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const configs: Config<TpcBill>[] = [
    {
      header: "收到日期",
      accessor: "",
      render: (rowData) => {
        return <Box>{formatDateTime(rowData.billReceivedDate)}</Box>;
      },
    },
    {
      header: "電費單下載",
      render: (rowData) => {
        return (
          <IconBtn
            icon={<FileDownloadOutlinedIcon />}
            onClick={() => {
              handleDownload(rowData.billDoc);
              setCurrentTPCBill(rowData);
            }}
          />
        );
      },
    },
    {
      header: "修改 / 刪除",
      render: (userBill) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              setCurrentTPCBill(userBill);
              // setOpenUpdateDialog(true);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            icon={<DeleteOutlined />}
            onClick={() => {
              setCurrentTPCBill(userBill);
              setOpenDeleteDialog(true);
            }}
          />
        </>
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
        onPageChange={refetch}
      />
      {openDeleteDialog && currentTPCBill ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除電費單"}
          content={"是否確認要刪除電費單？"}
          onConfirm={() => {
            removeTPCBill({
              variables: { id: currentTPCBill.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setOpenDeleteDialog(false);
                router.push("/applications");
              },
            });
          }}
          onClose={() => setOpenDeleteDialog(false)}
        />
      ) : null}
    </>
  );
};

export default TPCPanel;
