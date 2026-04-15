import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { AuthLayout } from "@components/Layout";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ReactElement, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import dynamic from "next/dynamic";
import { SvgIconComponent } from "@mui/icons-material";
import InfoBox from "@components/InfoBox";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { AuthGuard } from "@components/AuthGuard";
import PageErrorBoundary from "@components/ErrorBoundary/PageErrorBoundary";
import { Role } from "@core/graphql/types";
import { useEmailConfig } from "@utils/hooks/queries/useEmailConfig";
import { useUpdateEmailConfig } from "@utils/hooks/mutations/useUpdateEmailConfig";
import { toast } from "react-toastify";

const SettingDialog = dynamic(
  () => import("@components/Settings/SettingDialog")
);

enum ProfileInfoType {
  USER_NAME = "用戶名稱",
  ACCOMPANY_NAME = "公司名稱",
  USER_EMAIL = "用戶信箱",
}

const ProfileWithIcons = (props: {
  icon: SvgIconComponent;
  type: ProfileInfoType;
  text: string;
}) => {
  const { icon: Icon, type, text } = props;

  return (
    <Grid item>
      <Grid container direction={"row"} spacing={1} alignItems={"center"}>
        <Grid item>
          <Icon sx={{ color: "#009688" }}/>
        </Grid>
        <Grid item>
          <Grid container direction={"column"} spacing={0.5}>
            <Grid item>
              <Typography variant="body4">{type}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">{text}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const FIXED_TEST_RECIPIENTS = [
  "jay.chou@annealenergy.com",
  "jenny.tseng@annealenergy.com",
];

const EmailTestModeSection = () => {
  const { data, loading: queryLoading } = useEmailConfig();
  const [updateEmailConfig, { loading: mutationLoading }] = useUpdateEmailConfig();

  const emailConfig = data?.emailConfig;
  const [isTestMode, setIsTestMode] = useState<boolean | null>(null);
  const [testRecipients, setTestRecipients] = useState<string[] | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // 使用 local state 如果已修改，否則使用 server state
  const currentIsTestMode = isTestMode ?? emailConfig?.isTestMode ?? false;
  const currentTestRecipients = testRecipients ?? emailConfig?.testRecipients ?? [];
  const hasUnsavedChanges =
    isTestMode !== null || testRecipients !== null;

  const handleAddEmail = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Email 格式不正確");
      return;
    }

    if (
      currentTestRecipients.includes(trimmed) ||
      FIXED_TEST_RECIPIENTS.includes(trimmed)
    ) {
      setEmailError("此 Email 已存在");
      return;
    }

    setEmailError("");
    setTestRecipients([...currentTestRecipients, trimmed]);
    setNewEmail("");
  };

  const handleRemoveEmail = (email: string) => {
    setTestRecipients(currentTestRecipients.filter((e) => e !== email));
  };

  const handleSave = async () => {
    try {
      await updateEmailConfig({
        variables: {
          input: {
            isTestMode: currentIsTestMode,
            testRecipients: currentTestRecipients,
          },
        },
      });
      // 重設 local state，回到使用 server state
      setIsTestMode(null);
      setTestRecipients(null);
      toast.success("郵件測試模式設定已儲存");
    } catch {
      // useMutation 的 onError 已處理 toast
    }
  };

  if (queryLoading) return null;

  return (
    <Box margin="36px 32px">
      <Typography variant="h4" sx={{ mb: 3 }}>
        郵件測試模式
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Switch
          checked={currentIsTestMode}
          onChange={(e) => setIsTestMode(e.target.checked)}
          color="warning"
        />
        <Typography variant="body1">
          啟用測試模式
        </Typography>
        {currentIsTestMode && (
          <Chip
            label="測試模式已啟用"
            color="warning"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          測試收件人（固定）：
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {FIXED_TEST_RECIPIENTS.map((email) => (
            <Chip key={email} label={email} size="small" variant="outlined" />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          額外測試收件人：
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", mb: 1 }}>
          <TextField
            size="small"
            placeholder="輸入 Email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setEmailError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddEmail();
              }
            }}
            error={!!emailError}
            helperText={emailError}
            sx={{ minWidth: 300 }}
          />
          <IconButton onClick={handleAddEmail} color="primary" sx={{ mt: 0.25 }}>
            <AddIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {currentTestRecipients.map((email) => (
            <Chip
              key={email}
              label={email}
              size="small"
              onDelete={() => handleRemoveEmail(email)}
            />
          ))}
        </Box>
      </Box>

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={!hasUnsavedChanges || mutationLoading}
        sx={{ minWidth: 80 }}
      >
        {mutationLoading ? "儲存中..." : "儲存"}
      </Button>
    </Box>
  );
};

/** @TODO 銀行/分行名稱 */
const Settings = () => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const { me } = useAuth();

  return (
    <PageErrorBoundary>
      <Head>
        <title>帳戶設定</title>
        <meta name="description" content="帳戶設定" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "帳戶設定",
            icon: AccountCircleOutlinedIcon,
            href: "/settings",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <Card>
          <Box margin="36px 32px">
            <Grid container justifyContent={"space-between"}>
              <Typography variant="h4">帳戶資料</Typography>
              <IconBtn
                icon={<BorderColorOutlinedIcon />}
                onClick={() => {
                  setIsOpenDialog(true);
                }}
              />
            </Grid>
          </Box>

          {me ? (
            <Box display="flex" marginBottom="36px">
              <Container sx={{ margin: "32px 0", flex: 1 }}>
                <Typography variant="h5">個人資料</Typography>
                <Grid
                  container
                  direction={"column"}
                  spacing={2}
                  justifyContent={"center"}
                  sx={{ marginTop: "12px" }}
                >
                  <ProfileWithIcons
                    icon={PersonOutlineOutlinedIcon}
                    type={ProfileInfoType.USER_NAME}
                    text={me.name}
                  />
                  <ProfileWithIcons
                    icon={HomeOutlinedIcon}
                    type={ProfileInfoType.ACCOMPANY_NAME}
                    text={me.companyName ?? ""}
                  />
                  <ProfileWithIcons
                    icon={EmailOutlinedIcon}
                    type={ProfileInfoType.USER_EMAIL}
                    text={me.email}
                  />
                </Grid>
              </Container>

              <Divider orientation="vertical" flexItem />

              <Container sx={{ margin: "32px 0", flex: 1 }}>
                <Typography variant="h5">收款帳戶</Typography>
                <Box
                  sx={{
                    marginTop: "12px",
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "8px",
                  }}
                >
                  {(me.recipientAccounts ?? []).map((recipientAccount) => (
                    <Grid
                      container
                      key={recipientAccount.account}
                      sx={{
                        border: "2px solid #B2DFDB",
                        borderRadius: "4px",
                        padding: "8px 16px",
                      }}
                    >
                      <Grid item sm={4}>
                        <InfoBox
                          icon={CreditCardIcon}
                          label="銀行"
                          content={`${recipientAccount.bankCode}`}
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <InfoBox
                          icon={AccountCircleOutlinedIcon}
                          label="戶名"
                          content={recipientAccount.accountName}
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <InfoBox
                          icon={AccountBalanceWalletOutlinedIcon}
                          label="帳號"
                          content={recipientAccount.account}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              </Container>
            </Box>
          ) : null}
        </Card>
      </Box>

      <AuthGuard roles={[Role.Admin, Role.SuperAdmin]}>
        <Box sx={{ paddingTop: "12px" }}>
          <Card>
            <EmailTestModeSection />
          </Card>
        </Box>
      </AuthGuard>

      {isOpenDialog ? (
        <SettingDialog
          isOpenDialog={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
        />
      ) : null}
    </PageErrorBoundary>
  );
};

Settings.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Settings;
