import { Table } from "@components/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { IconBtn } from "@components/Button";
import { Config } from "@components/Table/Table";
import { Account, AccountPage } from "@core/graphql/types";

const PermissionsPanel = (props: {
  accounts?: AccountPage;
  loading?: boolean;
  onModifyClick?: (rowData: Account) => void;
  onDeleteClick?: (rowData: Account) => void;
  onSendPasswordClick?: (rowData: Account) => void;
}) => {
  const {
    accounts,
    loading = false,
    onModifyClick,
    onDeleteClick,
    onSendPasswordClick,
  } = props;

  const configs: Config<Account>[] = [
    {
      header: "信箱",
      accessor: "email",
    },
    {
      header: "用戶名稱",
      accessor: "name",
    },
    {
      header: "公司名稱",
      accessor: "companyName",
    },
    {
      header: "權限",
      accessor: "role",
    },
    {
      header: "修改 / 刪除",
      render: (data) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              onModifyClick?.(data);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            icon={<DeleteOutlined />}
            onClick={() => {
              onDeleteClick?.(data);
            }}
          />
        </>
      ),
    },
    {
      header: "發送密碼設定信件",
      render: (data) => (
        <IconBtn
          icon={<NearMeOutlinedIcon />}
          onClick={() => {
            onSendPasswordClick?.(data);
          }}
        ></IconBtn>
      ),
    },
  ];

  return (
    <Table
      configs={configs}
      list={accounts?.list}
      total={accounts?.total}
      loading={loading}
      // onPageChange={(page) =>
      //   refetch({
      //     limit: page.rows,
      //     offset: page.rows * page.index,
      //   })
      // }
    />
  );
};

export default PermissionsPanel;
