import { Table } from "@components/Table";
import { Fee, Role, UserBill, UserBillPage } from "@core/graphql/types";
import { Config, Page } from "../Table/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ActionTypeEnum } from "@core/types/actionTypeEnum";
import { useState } from "react";
import { UserBillDownloadDialog } from "@components/UserBill/UserBillDownloadDialog";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import dynamic from "next/dynamic";
import { useRemoveUserBill } from "@utils/hooks/mutations/useRemoveUserBill";
import { toast } from "react-toastify";
import UserBillDialog from "@components/UserBill/UserBillDialog/UserBillDialog";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface UserBillPanelProps {
  userBills?: UserBillPage;
  loading?: boolean;
  refetchFn: (userBill: Page) => void;
  onAction: (action: ActionTypeEnum, userBill?: UserBill) => void;
  fee: Fee;
}

const UserBillPanel = (props: UserBillPanelProps) => {
  const { userBills, loading = false, refetchFn, onAction, fee } = props;
  const { me } = useAuth();
  const router = useRouter();
  const [currentUserBill, setCurrentUserBill] = useState<UserBill | null>(null);
  const [isOpenDialog, setOpenDownloadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [removeUserBill] = useRemoveUserBill();

  const configs: Config<UserBill>[] = [
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
          onClick={() => router.push(`/user-bill/${rowData.id}`)}
        >
          {rowData.name}
        </Box>
      ),
    },
    {
      header: "用戶",
      render: (rowData) => {
        return <Box>{rowData.user.name}</Box>;
      },
    },
    {
      header: "本月使用度數",
      // render: (rowData) => {
      //   return <Box>{addUp(rowData.thisYearTransferRecords)}</Box>;
      // },
    },
    {
      header: "電費單下載",
      render: (rowData) => {
        return (
          <IconBtn
            icon={<FileDownloadOutlinedIcon />}
            onClick={() => {
              setOpenDownloadDialog(true);
              setCurrentUserBill(rowData);
            }}
          />
        );
      },
    },
    {
      header: "大樓電費單下載",
      /** @TODO */
    },
    {
      header: "修改 / 刪除",
      render: (userBill) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              setCurrentUserBill(userBill);
              setOpenUpdateDialog(true);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            disabled={!me || me.role === Role.User}
            icon={<DeleteOutlined />}
            onClick={() => {
              setCurrentUserBill(userBill);
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
        list={userBills?.list}
        total={userBills?.total}
        loading={loading}
        onPageChange={refetchFn}
      />

      {currentUserBill && currentUserBill ? (
        <UserBillDownloadDialog
          fee={fee}
          userBill={currentUserBill}
          isOpenDialog={isOpenDialog}
          onClose={() => setOpenDownloadDialog(false)}
        />
      ) : null}

      {openUpdateDialog && currentUserBill ? (
        <UserBillDialog
          isOpenDialog={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          variant="edit"
          currentModifyUserBill={currentUserBill}
        />
      ) : null}

      {openDeleteDialog && currentUserBill ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除電費單"}
          content={"是否確認要刪除電費單？"}
          onConfirm={() => {
            removeUserBill({
              variables: { id: currentUserBill.id },
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

export default UserBillPanel;
