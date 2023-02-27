import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, Button, Grid, Typography } from "@mui/material";
import { FieldsController } from "@components/Controller";
import FieldConfig, { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import Dialog from "@components/Dialog";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import { useAuth } from "@core/context/auth";
import { useModifyProfile } from "@utils/hooks/mutations/useModifyProfile";
import { toast } from "react-toastify";

type FormData = {
  name: string;
  company_name: string;
  email: string;
};

interface SettingDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
}

function SettingDialog(props: SettingDialogProps) {
  const { isOpenDialog, onClose } = props;
  const { me, logIn } = useAuth();
  const settingsFieldConfigs: FieldConfig[] = [
    {
      type: "TEXT",
      name: "name",
      label: "用戶名稱",
      validated: textValidated,
    },
    {
      type: "TEXT",
      name: "company_name",
      label: "公司名稱",
      disabled: true,
    },
    {
      type: "TEXT",
      name: "email",
      label: "用戶信箱",
      validated: textValidated.email,
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(settingsFieldConfigs, {
    defaultValues: {
      name: me?.name,
      company_name: me?.companyName,
      email: me?.email,
    },
  });

  const [modifyProfile] = useModifyProfile();

  const onSubmit = async (formData: FormData) => {
    const data = await modifyProfile({
      variables: {
        name: formData.name,
        email: formData.email,
      },
    });

    if (data.data?.modifyProfile.__typename === "Success") {
      // refetch 用戶資料
      logIn();
      toast.success("修改成功！");
      onClose();
    }
  };
  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="h4" textAlign={"left"}>
          修改個人資料
        </Typography>
        <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
      </Grid>
      <Typography variant="h5" textAlign={"left"}>
        個人資料
      </Typography>
      <FieldsController
        configs={settingsFieldConfigs}
        form={{ control, errors }}
      />
      <Box justifyContent={"flex-start"} alignItems={"center"} gap={"10px"}>
        <Button
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSubmit(onSubmit)}
        >
          儲存
        </Button>
        <Button
          startIcon={<CancelOutlined />}
          sx={{
            "&.MuiButton-text": {
              backgroundColor: "transparent",
              background: "primary.dark",
              color: "primary.dark",
            },
            ".MuiButton-startIcon": {
              svg: {
                color: "primary.dark",
              },
            },
          }}
          onClick={onClose}
        >
          取消
        </Button>
      </Box>
    </Dialog>
  );
}

export default SettingDialog;
