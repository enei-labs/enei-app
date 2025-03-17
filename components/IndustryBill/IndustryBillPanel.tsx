import { Table } from "@components/Table";
import { Fee, Role, IndustryBill, IndustryBillPage } from "@core/graphql/types";
import { Config, Page } from "../Table/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ActionTypeEnum } from "@core/types/actionTypeEnum";
import { useState } from "react";
import { IndustryBillDownloadDialog } from "@components/IndustryBill/IndustryBillDownloadDialog";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import dynamic from "next/dynamic";
import { useRemoveIndustryBill } from "@utils/hooks/mutations/useRemoveIndustryBill";
import { toast } from "react-toastify";
import IndustryBillDialog from "@components/IndustryBill/IndustryBillDialog/IndustryBillDialog";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface IndustryBillPanelProps {
  industryBills?: IndustryBillPage;
  loading?: boolean;
  refetchFn: (industryBill: Page) => void;
  onAction: (action: ActionTypeEnum, industryBill?: IndustryBill) => void;
  fee: Fee;
}

const IndustryBillPanel = (props: IndustryBillPanelProps) => {
  const { industryBills, loading = false, refetchFn, onAction, fee } = props;
  const { me } = useAuth();
  const router = useRouter();
  const [currentIndustryBill, setCurrentIndustryBill] =
    useState<IndustryBill | null>(null);
  const [isOpenDialog, setOpenDownloadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [removeIndustryBill] = useRemoveIndustryBill();

  const configs: Config<IndustryBill>[] = [
    {
      header: "電費單名稱",
      accessor: "name",
      render: (rowData) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => router.push(`/industry-bill/${rowData.id}`)}
        >
          {rowData.name}
        </Box>
      ),
    },
    {
      header: "發電業",
      render: (rowData) => {
        return <Box>{rowData.industry.name}</Box>;
      },
    },
    {
      header: "電費單下載",
      render: (rowData) => {
        return (
          <IconBtn
            icon={<FileDownloadOutlinedIcon />}
            onClick={() => {
              setOpenDownloadDialog(true);
              setCurrentIndustryBill(rowData);
            }}
          />
        );
      },
    },
    {
      header: "修改 / 刪除",
      render: (industryBill) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              setCurrentIndustryBill(industryBill);
              setOpenUpdateDialog(true);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            disabled={!me || me.role === Role.User}
            icon={<DeleteOutlined />}
            onClick={() => {
              setCurrentIndustryBill(industryBill);
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
        list={industryBills?.list}
        total={industryBills?.total}
        loading={loading}
        onPageChange={refetchFn}
      />

      {currentIndustryBill && currentIndustryBill ? (
        <IndustryBillDownloadDialog
          fee={fee}
          industryBill={currentIndustryBill}
          isOpenDialog={isOpenDialog}
          onClose={() => setOpenDownloadDialog(false)}
        />
      ) : null}

      {openUpdateDialog && currentIndustryBill ? (
        <IndustryBillDialog
          isOpenDialog={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          variant="edit"
          currentModifyIndustryBill={currentIndustryBill}
        />
      ) : null}

      {openDeleteDialog && currentIndustryBill ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除電費單"}
          content={"是否確認要刪除電費單？"}
          onConfirm={() => {
            removeIndustryBill({
              variables: { id: currentIndustryBill.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setOpenDeleteDialog(false);
              },
            });
          }}
          onClose={() => setOpenDeleteDialog(false)}
        />
      ) : null}
    </>
  );
};

export default IndustryBillPanel;
