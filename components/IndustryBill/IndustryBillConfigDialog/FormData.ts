import { IndustryBillConfigChargeType } from "@core/graphql/types";

export type FormData = {
  name: string;
  industryId: {
    label: string,
    value: string;
  };
  // recipientAccount: {
  //   label: string;
  //   value: {
  //     bankCode: string;
  //     account: string;
  //   }
  // };
  estimatedBillDeliverDate: number;
  paymentDeadline: number;
  transportationFee: IndustryBillConfigChargeType;
  credentialInspectionFee: IndustryBillConfigChargeType;
  credentialServiceFee: IndustryBillConfigChargeType;
  noticeForTPCBill: boolean;
  electricNumberInfos: {
    number: {
      label: string;
      value: string;
    };
    price: string;
  }[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
}
