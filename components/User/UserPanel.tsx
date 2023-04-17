import { Table } from "@components/Table";
import { Role, User, UserPage } from "@core/graphql/types";
import { Config, Page } from "../Table/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

enum ActionTypeEnum {
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
}

interface UserPanelProps {
  users?: UserPage;
  loading?: boolean;
  refetchFn: (user: Page) => void;
  onAction: (action: ActionTypeEnum, user?: User) => void;
}

const UserPanel = (props: UserPanelProps) => {
  const { users, loading = false, refetchFn, onAction } = props;
  const { me } = useAuth();
  const router = useRouter();

  const configs: Config<User>[] = [
    {
      header: "用戶名稱",
      accessor: "name",
      render: (rowData) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => router.push(`/user/${rowData.id}`)}
        >
          {rowData.name}
        </Box>
      ),
    },
    {
      header: "上月度數",
      accessor: "taxId",
    },
    {
      header: "今年度累積轉供度數",
      accessor: "contactName",
    },
    {
      header: "今年預估轉供度數",
      accessor: "contactPhone",
    },
    {
      header: "平均購電價格",
      accessor: "contactEmail",
    },
    {
      header: "警示提醒",
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
        list={users?.list}
        total={users?.total}
        loading={loading}
        onPageChange={refetchFn}
      />
    </>
  );
};

export default UserPanel;
