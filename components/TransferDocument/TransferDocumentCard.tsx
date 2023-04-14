import { IconBtn } from "@components/Button";
import { TransferDocument } from "@core/graphql/types";
import { Box, Card, Typography } from "@mui/material";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";

interface TransferDocumentProps {
  transferDocument: TransferDocument;
}

function TransferDocumentCard(props: TransferDocumentProps) {
  const { transferDocument } = props;
  return (
    <Card sx={{ p: "36px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{`${transferDocument.number}(${transferDocument.name})`}</Typography>
        <Box sx={{ display: "flex" }}>
          {/* <EditCompanyContractBtn companyContract={companyContract} /> */}
          <IconBtn icon={<DeleteOutlined />} onClick={() => {}} />
        </Box>
      </Box>
    </Card>
  );
}

export default TransferDocumentCard;
