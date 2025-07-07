import { Table } from "@components/Table";
import { Role, TransferDegree, User, UserPage } from "@core/graphql/types";
import { Config, Page } from "../Table/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import ErrorBoundary from "@components/ErrorBoundary";

enum ActionTypeEnum {
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
}

const addUp = (transferRecords: TransferDegree[]) =>
  transferRecords?.reduce((prev, curr) => prev + curr.degree, 0);

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
      header: "Email",
      accessor: "contactEmail",
    },
    {
      header: "上月度數",
      render: (rowData) => {
        // return <Box>{addUp(rowData.lastMonthTransferRecords)}</Box>;
        return <Box>0</Box>;
      },
    },
    {
      header: "今年度累積轉供度數",
      render: (rowData) => {
        return <Box>0</Box>;
        // return <Box>{addUp(rowData.thisYearTransferRecords)}</Box>;
      },
    },
    {
      header: "今年預估轉供度數",
      render: (rowData) => {
        // return 
        return <Box>0</Box>;
      },
    },
    {
      header: "平均購電價格",
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
            disabled={!me || me.role === Role.User}
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
    <ErrorBoundary>
      <Table
        configs={configs}
        list={users?.list}
        total={users?.total}
        loading={loading}
        onPageChange={refetchFn}
      />
    </ErrorBoundary>
  );
};

export default UserPanel;
