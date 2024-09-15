import { Grid, Typography } from "@mui/material";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IndustryBill } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import Dialog from "@components/Dialog";
import { FormData } from "@components/IndustryBill/IndustryBillDialog/FormData";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "@components/Input";
import RadioGroup from "@components/RadioGroup";
import { ChargeType } from "@core/graphql/types";
import { ElectricNumbersField } from "@components/IndustryBill/IndustryBillDialog/ElectricNumbersField";
import { useCompanies } from "@utils/hooks/queries";
import CreateUserBillBtn from "@components/UserBill/UserBillDialog/CreateUserBillBtn";
import UpdateUserBillBtn from "@components/UserBill/UserBillDialog/UpdateUserBillBtn";

interface IndustryBillDialogProps {
  isOpenDialog: boolean;
  currentModifyIndustryBill?: IndustryBill;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

const ChargeTypeRadios = [
  {
    label: "向發電業收取",
    value: ChargeType.User,
  },
  {
    label: "自行負擔",
    value: ChargeType.Self,
  },
];

const YesOrNoRadios = [
  {
    label: "是",
    value: true,
  },
  {
    label: "不是",
    value: false,
  },
];

function IndustryBillDialog(props: IndustryBillDialogProps) {
  const { isOpenDialog, onClose, currentModifyIndustryBill, variant } = props;

  const { data, loading } = useCompanies();

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({
    defaultValues: currentModifyIndustryBill
      ? {
          name: currentModifyIndustryBill.name,
          industryId: {
            label: currentModifyIndustryBill.industry.contactEmail,
            value: currentModifyIndustryBill.industry.id,
          },
          recipientAccount: {
            label: `(${currentModifyIndustryBill.recipientAccount.bankCode}) ${currentModifyIndustryBill.recipientAccount.account}`,
            value: {
              bankCode: currentModifyIndustryBill.recipientAccount.bankCode,
              account: currentModifyIndustryBill.recipientAccount.account,
            },
          },
          estimatedBillDeliverDate:
            currentModifyIndustryBill.estimatedBillDeliverDate,
          paymentDeadline: currentModifyIndustryBill.paymentDeadline,
          transportationFee: currentModifyIndustryBill.transportationFee,
          credentialInspectionFee:
            currentModifyIndustryBill.credentialInspectionFee,
          credentialServiceFee: currentModifyIndustryBill.credentialServiceFee,
          noticeForTheBuilding: currentModifyIndustryBill.noticeForTheBuilding,
          noticeForTPCBill: currentModifyIndustryBill.noticeForTPCBill,
          electricNumberInfos: (
            currentModifyIndustryBill.electricNumberInfos ?? []
          ).map((info) => ({
            number: {
              label: info.number,
              value: info.number,
            },
            price: info.price,
          })),
          contactName: currentModifyIndustryBill.contactName,
          contactEmail: currentModifyIndustryBill.contactEmail,
          contactPhone: currentModifyIndustryBill.contactPhone,
          address: currentModifyIndustryBill.address,
        }
      : {},
  });

  const industryId = watch("industryId");

  const userInformationConfig: FieldConfig[] = [
    {
      type: "TEXT",
      name: "name",
      label: "電費單名稱",
      placeholder: "請填入",
      validated: textValidated,
    },
    {
      type: "SINGLE_SELECT",
      name: "recipientAccount",
      label: "發電業",
      placeholder: "請填入",
      validated: textValidated,
      options:
        // data?.companies.list
        //   .find((industry) => industryId?.value === industry.id)
        //   ?.companyContracts.map((b) => ({
        //     label: `${b.name}`,
        //     value: {
        //       name: b.name
        //     },
        //   })) ?? [],
        data?.companies.list.map((industry) => ({
            label: `${industry.contactEmail}(${industry.name})`,
            value: industry.id,
          })) ?? [],
      loading: loading,
    },
    {
      type: "NUMBER",
      name: "estimatedBillDeliverDate",
      label: "預計電費單寄出期限（收到繳費通知單後天數）",
      placeholder: "請填入",
      validated: textValidated,
    },
    {
      type: "NUMBER",
      name: "paymentDeadline",
      label: "售電業繳費期限（收到繳費通知單後天數）",
      placeholder: "請填入",
      validated: textValidated,
    },
  ];

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create" ? "新增電費單組合" : "修改電費單組合"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 用戶資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          電費單設定
        </Typography>
        <FieldsController
          configs={userInformationConfig}
          form={{ control, errors }}
        />

        <Controller
          control={control}
          name={"transportationFee"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="代輸費款項"
                radios={ChargeTypeRadios}
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"credentialInspectionFee"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="憑證審查費"
                radios={ChargeTypeRadios}
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"credentialServiceFee"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="憑證服務費"
                radios={ChargeTypeRadios}
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"noticeForTheBuilding"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="是否需要大樓通知單"
                radios={YesOrNoRadios}
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"noticeForTPCBill"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="是否需包含台電代輸費單"
                radios={YesOrNoRadios}
              />
            );
          }}
        />

        {/* 用戶電號 Block */}
        <Typography variant="h5" textAlign={"left"}>
          發電業電號
        </Typography>

        {industryId && industryId.value ? (
          <Controller
            control={control}
            name={`electricNumberInfos`}
            render={({ field }) => (
              <ElectricNumbersField
                field={field}
                control={control}
                companyId={industryId.value}
              />
            )}
          />
        ) : null}

        {/* 電費收件人資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          電費收件人資訊
        </Typography>

        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={"16px"}
          flexWrap={"nowrap"}
        >
          <Controller
            control={control}
            name={"contactName"}
            render={({ field }) => (
              <>
                <InputText
                  label={"收件人姓名"}
                  {...field}
                  placeholder={"請填入"}
                  required
                />
              </>
            )}
          ></Controller>
          <Controller
            control={control}
            name={"contactPhone"}
            render={({ field }) => (
              <>
                <InputText
                  label={"收件人電話"}
                  {...field}
                  placeholder={"請填入"}
                  required
                />
              </>
            )}
          ></Controller>
        </Grid>

        <Controller
          control={control}
          name={"contactEmail"}
          render={({ field }) => (
            <>
              <InputText
                label={"收件人信箱"}
                {...field}
                placeholder={"請填入"}
                required
              />
            </>
          )}
        ></Controller>

        <Controller
          control={control}
          name={"address"}
          render={({ field }) => (
            <>
              <InputText
                label={"收件人地址"}
                {...field}
                placeholder={"請填入"}
                required
              />
            </>
          )}
        ></Controller>

        {/* 按鈕區塊 */}
        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          {/* {!currentModifyIndustryBill ? (
            <CreateUserBillBtn handleSubmit={handleSubmit} onClose={onClose} />
          ) : (
            <UpdateUserBillBtn
              handleSubmit={handleSubmit}
              onClose={onClose}
              userBillId={currentModifyIndustryBill.id}
            />
          )} */}
        </Grid>
      </>

      {/* 刪除付款帳號 Dialog */}
      {/* {deleteAccountIndex !== -1 ? (
        <DialogAlert
          open={deleteAccountIndex !== -1}
          title={"刪除付款帳號"}
          content={"是否確認要刪除付款帳號？"}
          onConfirm={() => {
            remove(deleteAccountIndex);
            setDeleteAccountIndex(-1);
          }}
          onClose={() => {
            setDeleteAccountIndex(-1);
          }}
        />
      ) : null} */}
    </Dialog>
  );
}

export default IndustryBillDialog;
