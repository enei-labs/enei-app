import { Table } from "@components/Table";
import { TransferDocument, TransferDocumentPage } from "@core/graphql/types";
import { Config, Page } from "../Table/Table";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { formatDateTime } from "@utils/format";
import { ErrorBoundary } from "@components/ErrorBoundary";

interface TransferDocumentPanelProps {
  transferDocuments?: TransferDocumentPage;
  loading?: boolean;
  refetchFn: (transferDocument: Page) => void;
}

const TransferDocumentPanel = (props: TransferDocumentPanelProps) => {
  const { transferDocuments, loading = false, refetchFn } = props;
  const router = useRouter();

  const configs: Config<TransferDocument>[] = [
    {
      header: "轉供合約名稱",
      accessor: "name",
      render: (rowData) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => router.push(`/application/${rowData.id}`)}
        >
          {rowData.name}
        </Box>
      ),
    },
    {
      header: "轉供契約編號",
      accessor: "number",
    },
    {
      header: "轉供受理區處",
      accessor: "receptionAreas",
    },
    {
      header: "期望完成日",
      accessor: "expectedTime",
      render: (rowData) => <Box>{formatDateTime(rowData.expectedTime)}</Box>,
    },
  ];

  return (
    <ErrorBoundary>
      <Table
        configs={configs}
        list={transferDocuments?.list}
        total={transferDocuments?.total}
        loading={loading}
        onPageChange={refetchFn}
      />
    </ErrorBoundary>
  );
};

export default TransferDocumentPanel;
