import { Table } from "@components/Table";
import { Fee, Role, UserBillConfig } from "@core/graphql/types";
import { Config } from "../Table/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import UserBillConfigDialog from "@components/UserBill/UserBillConfigDialog/UserBillConfigDialog";
import { useUserBillConfigs } from "@utils/hooks/queries";
import { useRemoveUserBillConfig } from "@utils/hooks/mutations/useRemoveUserBillConfig";
const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface UserBillConfigPanelProps {
  fee: Fee;
}

const UserBillConfigPanel = (props: UserBillConfigPanelProps) => {
  const { fee } = props;
  const { me } = useAuth();
  const router = useRouter();

  const { data, loading, refetch } = useUserBillConfigs();

  const [currentUserBillConfig, setCurrentUserBillConfig] =
    useState<UserBillConfig | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [removeUserBillConfig] = useRemoveUserBillConfig();

  const configs: Config<UserBillConfig>[] = [
    {
      header: "電費單組合名稱",
      accessor: "name",
      render: (rowData) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => router.push(`/electric-bill/user-bill-config/${rowData.id}?userBillConfigName=${rowData.name}`)}
        >
          {rowData.name}
        </Box>
      )
    },
    {
      header: "修改 / 刪除",
      render: (userBillConfig) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              setCurrentUserBillConfig(userBillConfig);
              setOpenUpdateDialog(true);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            disabled={!me || me.role === Role.User}
            icon={<DeleteOutlined />}
            onClick={() => {
              setCurrentUserBillConfig(userBillConfig);
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
        list={data?.userBillConfigs?.list}
        total={data?.userBillConfigs?.total}
        loading={loading}
        onPageChange={(page) => {
          refetch({
            limit: page.rows,
            offset: page.rows * page.index,
          });
        }}
      />

      {openUpdateDialog && currentUserBillConfig ? (
        <UserBillConfigDialog
          isOpenDialog={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          variant="edit"
          currentModifyUserBillConfig={currentUserBillConfig}
        />
      ) : null}

      {openDeleteDialog && currentUserBillConfig ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除電費單組合"}
          content={"是否確認要刪除電費單組合？"}
          onConfirm={() => {
            removeUserBillConfig({
              variables: { id: currentUserBillConfig.id },
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

export default UserBillConfigPanel;
