import { Table } from "@components/Table";
import {
  Role,
  TransferDegree,
  UserBill,
  UserBillPage,
} from "@core/graphql/types";
import { Config, Page } from "../Table/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ActionTypeEnum } from "@core/types/actionTypeEnum";

interface UserBillPanelProps {
  userBills?: UserBillPage;
  loading?: boolean;
  refetchFn: (userBill: Page) => void;
  onAction: (action: ActionTypeEnum, userBill?: UserBill) => void;
}

const UserBillPanel = (props: UserBillPanelProps) => {
  const { userBills, loading = false, refetchFn, onAction } = props;
  const { me } = useAuth();
  const router = useRouter();

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
      // render: (rowData) => {
      //   return <Box>{addUp(rowData.lastMonthTransferRecords)}</Box>;
      // },
    },
    {
      header: "本月使用度數",
      // render: (rowData) => {
      //   return <Box>{addUp(rowData.thisYearTransferRecords)}</Box>;
      // },
    },
    {
      header: "電費單下載",
    },
    {
      header: "大樓電費單下載",
    },
    {
      header: "修改 / 刪除",
      render: (user) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              onAction(ActionTypeEnum.EDIT, user);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            disabled={me?.role !== Role.SuperAdmin}
            icon={<DeleteOutlined />}
            onClick={() => {
              onAction(ActionTypeEnum.DELETE, user);
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
    </>
  );
};

export default UserBillPanel;
