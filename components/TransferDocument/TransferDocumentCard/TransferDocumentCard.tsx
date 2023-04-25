import { IconBtn } from "@components/Button";
import { TransferDocument } from "@core/graphql/types";
import { Box, Card, Typography, Grid } from "@mui/material";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRemoveTransferDocument } from "@utils/hooks";
import { toast } from "react-toastify";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import TransferDocumentPowerPlant from "./TransferDocumentPowerPlant";
import TransferDocumentUsers from "./TransferDocumentUsers";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface TransferDocumentProps {
  transferDocument: TransferDocument;
}

function TransferDocumentCard(props: TransferDocumentProps) {
  const { transferDocument } = props;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [removeTransferDocument, { loading }] = useRemoveTransferDocument();

  console.log("transferDocument-->\n", transferDocument);

  return (
    <>
      <Card sx={{ p: "36px", maxWidth: "1208px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 0 32px 0",
          }}
        >
          <Typography variant="h4">{`${transferDocument.number}(${transferDocument.name})`}</Typography>
          <Box sx={{ display: "flex" }}>
            {/* <EditCompanyContractBtn companyContract={companyContract} /> */}
            <IconBtn
              icon={<DriveFileRenameOutlineOutlinedIcon />}
              onClick={() => {}}
            />
            <IconBtn icon={<DeleteOutlined />} onClick={() => {}} />
          </Box>
        </Box>
        <Typography sx={{ margin: "0 0 24px 0" }} variant="h5">
          {`轉供組合 ${transferDocument.transferDocumentPowerPlants.length} 轉 ${transferDocument.transferDocumentUsers.length}`}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TransferDocumentPowerPlant
              transferDocumentPowerPlants={
                transferDocument.transferDocumentPowerPlants
              }
            />
          </Grid>
          <Grid item xs={8}>
            <TransferDocumentUsers
              transferDocumentUsers={transferDocument.transferDocumentUsers}
            />
          </Grid>
        </Grid>
      </Card>
      {openDeleteDialog ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除轉供合約"}
          content={"是否確認要刪除轉供合約？"}
          onConfirm={() => {
            removeTransferDocument({
              variables: { id: transferDocument.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setOpenDeleteDialog(false);
              },
            });
          }}
          onClose={() => {
            setOpenDeleteDialog(false);
          }}
        />
      ) : null}
    </>
  );
}

export default TransferDocumentCard;
