import { UserBillConfigChargeType } from "@core/graphql/types";

export type FormData = {
  name: string;
  userId: {
    label: string,
    value: string;
  };
  recipientAccount: {
    label: string;
    value: {
      bankCode: string;
      bankBranchCode?: string;
      account: string;
    }
  };
  estimatedBillDeliverDate: number;
  paymentDeadline: number;
  transportationFee: UserBillConfigChargeType;
  credentialInspectionFee: UserBillConfigChargeType;
  credentialServiceFee: UserBillConfigChargeType;
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
