import { Grid, Typography } from "@mui/material";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IndustryBillConfig } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import Dialog from "@components/Dialog";
import { FormData } from "@components/IndustryBill/IndustryBillConfigDialog/FormData";
import { Controller, useForm, Control } from "react-hook-form";
import { InputText } from "@components/Input";
import RadioGroup from "@components/RadioGroup";
import { ElectricNumbersField } from "@components/IndustryBill/IndustryBillConfigDialog/ElectricNumbersField";
import { useCompanies } from "@utils/hooks/queries";
import CreateIndustryBillBtn from "@components/IndustryBill/IndustryBillConfigDialog/CreateIndustryBillConfigBtn";
import UpdateIndustryBillBtn from "@components/IndustryBill/IndustryBillConfigDialog/UpdateIndustryBillConfigBtn";
import { useCallback, useMemo, memo } from "react";

interface IndustryBillDialogProps {
  isOpenDialog: boolean;
  currentModifyIndustryBillConfig?: IndustryBillConfig;
  variant: "edit" | "create";
  onClose: () => void;
}

const YES_NO_RADIOS = [
  { label: "是", value: true },
  { label: "不是", value: false },
];

const SECTION_TITLES = {
  INDUSTRY_INFO: "發電業資訊",
  ELECTRIC_NUMBERS: "發電業電號",
  CONTACT_INFO: "電費收件人資訊",
} as const;

const DIALOG_TITLES = {
  CREATE: "新增發電業電費單組合",
  EDIT: "修改發電業電費單組合",
} as const;

const PLACEHOLDERS = {
  DEFAULT: "請填入",
} as const;

// Types for component props
type DialogHeaderProps = {
  variant: "edit" | "create";
  onClose: () => void;
};

type SectionHeaderProps = {
  title: string;
};

type ContactInfoFieldProps = {
  control: Control<FormData>;
  name: keyof Pick<FormData, "contactName" | "contactPhone" | "contactEmail" | "address">;
  label: string;
};

type ContactInfoSectionProps = {
  control: Control<FormData>;
};

type ActionButtonsProps = {
  currentModifyIndustryBillConfig?: IndustryBillConfig;
  handleSubmit: ReturnType<typeof useForm<FormData>>["handleSubmit"];
  onClose: () => void;
};

// Extract reusable components
const DialogHeader = memo<DialogHeaderProps>(function DialogHeader({ variant, onClose }) {
  return (
    <Grid container justifyContent={"space-between"} alignItems={"center"}>
      <Typography variant="h4" textAlign={"left"}>
        {variant === "create" ? DIALOG_TITLES.CREATE : DIALOG_TITLES.EDIT}
      </Typography>
      <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
    </Grid>
  );
});

const SectionHeader = memo<SectionHeaderProps>(function SectionHeader({ title }) {
  return (
    <Typography variant="h5" textAlign={"left"}>
      {title}
    </Typography>
  );
});

const ContactInfoField = memo<ContactInfoFieldProps>(function ContactInfoField({ control, name, label }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <InputText
          label={label}
          {...field}
          placeholder={PLACEHOLDERS.DEFAULT}
          required
        />
      )}
    />
  );
});

const ContactInfoSection = memo<ContactInfoSectionProps>(function ContactInfoSection({ control }) {
  return (
    <>
      <SectionHeader title={SECTION_TITLES.CONTACT_INFO} />
      <Grid
        container
        justifyContent={"flex-start"}
        alignItems={"center"}
        flexDirection={"row"}
        gap={"16px"}
        flexWrap={"nowrap"}
      >
        <ContactInfoField control={control} name="contactName" label="收件人姓名" />
        <ContactInfoField control={control} name="contactPhone" label="收件人電話" />
      </Grid>
      <ContactInfoField control={control} name="contactEmail" label="收件人信箱" />
      <ContactInfoField control={control} name="address" label="收件人地址" />
    </>
  );
});

const ActionButtons = memo<ActionButtonsProps>(function ActionButtons({ 
  currentModifyIndustryBillConfig, 
  handleSubmit, 
  onClose 
}) {
  return (
    <Grid
      container
      justifyContent={"flex-start"}
      alignItems={"center"}
      gap={"10px"}
    >
      {!currentModifyIndustryBillConfig ? (
        <CreateIndustryBillBtn handleSubmit={handleSubmit} onClose={onClose} />
      ) : (
        <UpdateIndustryBillBtn
          handleSubmit={handleSubmit}
          onClose={onClose}
          industryBillId={currentModifyIndustryBillConfig.id}
        />
      )}
    </Grid>
  );
});

function IndustryBillConfigDialog(props: IndustryBillDialogProps): JSX.Element {
  const { isOpenDialog, onClose, currentModifyIndustryBillConfig, variant } =
    props;

  const { data, loading, fetchMore } = useCompanies();

  const defaultValues = useMemo(() => {
    if (!currentModifyIndustryBillConfig) return {};
    
    return {
      name: currentModifyIndustryBillConfig.name,
      industryId: {
        label: currentModifyIndustryBillConfig.industry.contactEmail,
        value: currentModifyIndustryBillConfig.industry.id,
      },
      recipientAccount: {
        label: `(${currentModifyIndustryBillConfig.recipientAccount.bankCode}) ${currentModifyIndustryBillConfig.recipientAccount.account}`,
        value: {
          bankCode: currentModifyIndustryBillConfig.recipientAccount.bankCode,
          account: currentModifyIndustryBillConfig.recipientAccount.account,
        },
      },
      estimatedBillDeliverDate: currentModifyIndustryBillConfig.estimatedBillDeliverDate,
      paymentDeadline: currentModifyIndustryBillConfig.paymentDeadline,
      noticeForTPCBill: currentModifyIndustryBillConfig.noticeForTPCBill,
      electricNumberInfos: (currentModifyIndustryBillConfig.electricNumbers ?? []).map((number) => ({
        number: { label: number, value: number },
        price: "",
      })),
      contactName: currentModifyIndustryBillConfig.contactName,
      contactEmail: currentModifyIndustryBillConfig.contactEmail,
      contactPhone: currentModifyIndustryBillConfig.contactPhone,
      address: currentModifyIndustryBillConfig.address,
    };
  }, [currentModifyIndustryBillConfig]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({ defaultValues });

  const industryId = watch("industryId") as FormData["industryId"] | undefined;

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

  const industryInformationConfig: FieldConfig[] = useMemo(
    () => [
      {
        type: "TEXT",
        name: "name",
        label: "電費單組合名稱",
        placeholder: PLACEHOLDERS.DEFAULT,
        validated: textValidated,
        required: true,
      },
      {
        type: "SINGLE_SELECT",
        name: "industryId",
        label: "發電業",
        placeholder: PLACEHOLDERS.DEFAULT,
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
        placeholder: PLACEHOLDERS.DEFAULT,
        validated: textValidated,
      },
      {
        type: "NUMBER",
        name: "paymentDeadline",
        label: "售電業繳費期限（收到繳費通知單後天數）",
        placeholder: PLACEHOLDERS.DEFAULT,
        validated: textValidated,
        required: true,
      },
    ],
    [data?.companies.list, loading, companiesLoadMore]
  );

  return (
    <>
      <Dialog open={isOpenDialog} onClose={onClose} maxWidth="md">
        <DialogHeader variant={variant} onClose={onClose} />

          {/* 發電業資訊 Block */}
          <SectionHeader title={SECTION_TITLES.INDUSTRY_INFO} />
          <FieldsController
            configs={industryInformationConfig}
            form={{ control, errors }}
          />

          <Controller
            control={control}
            name={"noticeForTPCBill"}
            render={({ field }) => (
              <RadioGroup
                {...field}
                label="是否需包含台電代輸費單"
                radios={YES_NO_RADIOS}
              />
            )}
          />

          {/* 發電業電號 Block */}
          <SectionHeader title={SECTION_TITLES.ELECTRIC_NUMBERS} />

          {industryId?.value && (
            <Controller
              control={control}
              name="electricNumberInfos"
              render={({ field }) => (
                <ElectricNumbersField
                  currentModifyIndustryBillConfig={currentModifyIndustryBillConfig}
                  field={field}
                  control={control}
                  companyId={industryId.value}
                />
              )}
            />
          )}

          {/* 電費收件人資訊 Block */}
          <ContactInfoSection control={control} />

          {/* 按鈕區塊 */}
          <ActionButtons
            currentModifyIndustryBillConfig={currentModifyIndustryBillConfig}
            handleSubmit={handleSubmit}
            onClose={onClose}
          />
      </Dialog>
    </>
  );
}

export default IndustryBillConfigDialog;
