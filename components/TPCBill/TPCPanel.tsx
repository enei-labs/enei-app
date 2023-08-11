import { IconBtn } from "@components/Button";
import Table, { Config } from "@components/Table/Table";
import { TpcBill, TransferDocument } from "@core/graphql/types";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useTpcBills } from "@utils/hooks/queries";
import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useRemoveTPCBill } from "@utils/hooks";
import { useRouter } from "next/router";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface TPCPanelProps {
  transferDocument: TransferDocument;
}

const TPCPanel = (props: TPCPanelProps) => {
  const { transferDocument } = props;
  const router = useRouter();
  const { data, loading, refetch } = useTpcBills({
    transferDocumentId: transferDocument.id,
  });
  const [removeTPCBill] = useRemoveTPCBill();
  const [currentTPCBill, setCurrentTPCBill] = useState<TpcBill | null>(null);
  const [isOpenDialog, setOpenDownloadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const configs: Config<TpcBill>[] = [
    {
      header: "收到日期",
      accessor: "date",
    },
    {
      header: "電費單下載",
      render: (rowData) => {
        return (
          <IconBtn
            icon={<FileDownloadOutlinedIcon />}
            onClick={() => {
              setOpenDownloadDialog(true);
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
        list={data?.tpcBills.list}
        total={data?.tpcBills.total}
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
