import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { AuthLayout } from "@components/Layout";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
    Button,
    Card,
    Container,
    Grid,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import { ReactElement, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { FieldsController } from "@components/Controller";
import FieldConfig, { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import Dialog from "@components/Dialog";
import { ActionBtn, IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { CancelOutlined } from "@mui/icons-material";

enum ProfileInfoType {
    USER_NAME = "用戶名稱",
    ACCOMPANY_NAME = "公司名稱",
    USER_EMAIL = "用戶信箱",
}

const ProfileWithIcons = (props: {
    Icon: React.ElementType;
    type: ProfileInfoType;
    text: string;
}) => {
    const { Icon, type, text } = props;

    return (
        <Grid item>
            <Grid container direction={"row"} spacing={1} alignItems={"center"}>
                <Grid item>
                    <Icon />
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
        validated: textValidated,
    },
    {
        type: "TEXT",
        name: "email",
        label: "用戶信箱",
        validated: textValidated,
    },
];

const Settings = () => {
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useValidatedForm<FormData>(settingsFieldConfigs);

    return (
        <>
            <Head>
                <title>帳戶設定</title>
                <meta name="description" content="帳戶設定" />
            </Head>
            <Toolbar></Toolbar>
            <IconBreadcrumbs
                items={[
                    {
                        name: "帳戶設定",
                        icon: AccountCircleOutlinedIcon,
                        href: "/settings",
                    },
                ]}
            />

            <Card>
                <Container sx={{ marginTop: "44px" }}>
                    <Grid container justifyContent={"space-between"}>
                        <Typography variant="h4">個人資料</Typography>
                        <IconBtn
                            icon={<BorderColorOutlinedIcon />}
                            onClick={() => {
                                setIsOpenDialog(true);
                            }}
                        />
                    </Grid>
                </Container>

                <Container sx={{ margin: "32px 0" }}>
                    <Grid
                        container
                        direction={"column"}
                        spacing={2}
                        justifyContent={"center"}
                        sx={{ padding: "0 10px" }}
                    >
                        <ProfileWithIcons
                            Icon={PersonOutlineOutlinedIcon}
                            type={ProfileInfoType.USER_NAME}
                            text={"麥綠電"}
                        ></ProfileWithIcons>
                        <ProfileWithIcons
                            Icon={HomeOutlinedIcon}
                            type={ProfileInfoType.ACCOMPANY_NAME}
                            text={"綠電用戶"}
                        ></ProfileWithIcons>
                        <ProfileWithIcons
                            Icon={EmailOutlinedIcon}
                            type={ProfileInfoType.USER_EMAIL}
                            text={"abc123@gmail.com"}
                        ></ProfileWithIcons>
                    </Grid>
                </Container>
            </Card>

            <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
                <Grid
                    container
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography variant="h4" textAlign={"left"}>
                        修改個人資料
                    </Typography>
                    <IconBtn
                        icon={<HighlightOffIcon />}
                        onClick={() => {
                            setIsOpenDialog(false);
                        }}
                    />
                </Grid>
                <Typography variant="h5" textAlign={"left"}>
                    個人資料
                </Typography>
                <FieldsController
                    configs={settingsFieldConfigs}
                    form={{ control, errors }}
                />
                <Grid
                    container
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    gap={"10px"}
                >
                    <Button startIcon={<SaveOutlinedIcon />}>儲存</Button>
                    <Button
                        startIcon={<CancelOutlined />}
                        sx={{
                            "&.MuiButton-text": {
                                backgroundColor: "transparent",
                                color: "text.primary",
                            },
                        }}
                    >
                        取消
                    </Button>
                </Grid>
            </Dialog>
        </>
    );
};

// Settings.getLayout = (page: ReactElement) => {
//     return <AuthLayout>{page}</AuthLayout>;
// };

export default Settings;
