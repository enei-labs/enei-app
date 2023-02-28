import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, Button, Typography } from "@mui/material";
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
import { LoadingButton } from "@mui/lab";

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
      validated: textValidated.email(),
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

  const [modifyProfile, { loading }] = useModifyProfile();

  const onSubmit = async (formData: FormData) => {
    const data = await modifyProfile({
      variables: {
        name: formData.name,
        email: formData.email,
      },
    });

    if (data) {
      // refetch 用戶資料
      logIn();
      toast.success("修改成功！");
      onClose();
    }
  };
  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" textAlign={"left"}>
          修改個人資料
        </Typography>
        <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
      </Box>
      <Typography variant="h5" textAlign={"left"}>
        個人資料
      </Typography>
      <FieldsController
        configs={settingsFieldConfigs}
        form={{ control, errors }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          columnGap: "10px",
        }}
      >
        <LoadingButton
          sx={{ height: "40px" }}
          loading={loading}
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSubmit(onSubmit)}
        >
          儲存
        </LoadingButton>
        <Button
          startIcon={<CancelOutlined />}
          sx={{
            height: "40px",
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
