import { Grid, Typography } from "@mui/material";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IndustryBillConfig } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import Dialog from "@components/Dialog";
import { FormData } from "@components/IndustryBill/IndustryBillConfigDialog/FormData";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "@components/Input";
import RadioGroup from "@components/RadioGroup";
import { ElectricNumbersField } from "@components/IndustryBill/IndustryBillConfigDialog/ElectricNumbersField";
import { useCompanies } from "@utils/hooks/queries";
import CreateIndustryBillBtn from "@components/IndustryBill/IndustryBillConfigDialog/CreateIndustryBillConfigBtn";
import UpdateIndustryBillBtn from "@components/IndustryBill/IndustryBillConfigDialog/UpdateIndustryBillConfigBtn";
import { useCallback } from "react";

interface IndustryBillDialogProps {
  isOpenDialog: boolean;
  currentModifyIndustryBillConfig?: IndustryBillConfig;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

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

function IndustryBillConfigDialog(props: IndustryBillDialogProps) {
  const { isOpenDialog, onClose, currentModifyIndustryBillConfig, variant } =
    props;

  const { data, loading, fetchMore } = useCompanies();

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({
    defaultValues: currentModifyIndustryBillConfig
      ? {
          name: currentModifyIndustryBillConfig.name,
          industryId: {
            label: currentModifyIndustryBillConfig.industry.contactEmail,
            value: currentModifyIndustryBillConfig.industry.id,
          },
          recipientAccount: {
            label: `(${currentModifyIndustryBillConfig.recipientAccount.bankCode}) ${currentModifyIndustryBillConfig.recipientAccount.account}`,
            value: {
              bankCode:
                currentModifyIndustryBillConfig.recipientAccount.bankCode,
              account: currentModifyIndustryBillConfig.recipientAccount.account,
            },
          },
          estimatedBillDeliverDate:
            currentModifyIndustryBillConfig.estimatedBillDeliverDate,
          paymentDeadline: currentModifyIndustryBillConfig.paymentDeadline,
          noticeForTPCBill: currentModifyIndustryBillConfig.noticeForTPCBill,
          // 不要在初始化設定
          electricNumberInfos: (
            currentModifyIndustryBillConfig.electricNumbers ?? []
          ).map((number) => ({
            number: {
              label: number,
              value: number,
            },
            price: "",
          })),
          contactName: currentModifyIndustryBillConfig.contactName,
          contactEmail: currentModifyIndustryBillConfig.contactEmail,
          contactPhone: currentModifyIndustryBillConfig.contactPhone,
          address: currentModifyIndustryBillConfig.address,
        }
      : {},
  });

  const industryId = watch("industryId");

  const companiesLoadMore = useCallback(
    () =>
      fetchMore({
        variables: {
          offset: data?.companies.list.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            companies: {
              total: fetchMoreResult.companies.total,
              list: [
                ...(prev?.companies?.list ?? []),
                ...fetchMoreResult.companies.list,
              ],
            },
          };
        },
      }),
    [data, fetchMore]
  );

  const industryInformationConfig: FieldConfig[] = [
    {
      type: "TEXT",
      name: "name",
      label: "電費單組合名稱",
      placeholder: "請填入",
      validated: textValidated,
      required: true,
    },
    {
      type: "SINGLE_SELECT",
      name: "industryId",
      label: "發電業",
      placeholder: "請填入",
      options:
        data?.companies.list.map((company) => ({
          label: `${company.contactEmail}(${company.name})`,
          value: company.id,
        })) ?? [],
      validated: textValidated,
      loading: loading,
      fetchMoreData: companiesLoadMore,
      required: true,
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
      required: true,
    },
  ];

  return (
    <Dialog open={isOpenDialog} onClose={onClose} maxWidth="md">
      <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create"
              ? "新增發電業電費單組合"
              : "修改發電業電費單組合"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 發電業資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          發電業資訊
        </Typography>
        <FieldsController
          configs={industryInformationConfig}
          form={{ control, errors }}
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

        {/* 發電業電號 Block */}
        <Typography variant="h5" textAlign={"left"}>
          發電業電號
        </Typography>

        {industryId && industryId.value ? (
          <Controller
            control={control}
            name={`electricNumberInfos`}
            render={({ field }) => (
              <ElectricNumbersField
                currentModifyIndustryBillConfig={
                  currentModifyIndustryBillConfig
                }
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
          {!currentModifyIndustryBillConfig ? (
            <CreateIndustryBillBtn
              handleSubmit={handleSubmit}
              onClose={onClose}
            />
          ) : (
            <UpdateIndustryBillBtn
              handleSubmit={handleSubmit}
              onClose={onClose}
              industryBillId={currentModifyIndustryBillConfig.id}
            />
          )}
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

export default IndustryBillConfigDialog;
