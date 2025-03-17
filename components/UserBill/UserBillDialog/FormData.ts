import { UserBillChargeType } from "@core/graphql/types";

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
      account: string;
    }
  };
  estimatedBillDeliverDate: number;
  paymentDeadline: number;
  transportationFee: UserBillChargeType;
  credentialInspectionFee: UserBillChargeType;
  credentialServiceFee: UserBillChargeType;
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
