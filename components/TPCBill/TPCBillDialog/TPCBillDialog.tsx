import Dialog from "@components/Dialog";
import { Grid, Typography } from "@mui/material";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FieldsController } from "@components/Controller";
import { useValidatedForm } from "@utils/hooks";
import { textValidated } from "@core/types/fieldConfig";

interface TPCBillDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  variant: 'create' | 'edit'
}

const basicInfoConfigs = [
  {
    type: "TEXT",
    name: "name",
    label: "轉供契約編號",
    placeholder: "請填入",
    validated: textValidated,
  },
  {
    type: "DATE",
    name: "number",
    label: "收到台電繳費單日期",
    placeholder: "請填入",
    validated: textValidated,
  },
]

export function TPCBillDialog(props: TPCBillDialogProps) {
  const { isOpenDialog, onClose, variant } = props;

  const {
    watch,
    control,
    formState: { errors },
    handleSubmit,
  } = useValidatedForm<FormData>(undefined)

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create" ? "新增台電代輸繳費單" : "修改台電代輸繳費單"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 代輸繳費單資料 Block */}
        <Typography variant="h5" textAlign={"left"}>
          代輸繳費單資料
        </Typography>
        <FieldsController
          configs={[]}
          form={{ control, errors }}
        />
      </>
    </Dialog>
  )
}