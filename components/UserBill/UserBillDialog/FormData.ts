import { ChargeType } from "@core/graphql/types";

export type FormData = {
  name: string;
  userId: {
    label: string,
    value: string;
  };
  recipientAccount: {
    bankCode: string;
    bankBranchCode: string;
    account: string;
  };
  estimatedBillDeliverDate: number;
  paymentDeadline: number;
  transportationFee: {
    label: string;
    value: ChargeType
  };
  credentialInspectionFee: {
    label: string;
    value: ChargeType
  };
  credentialServiceFee: {
    label: string;
    value: ChargeType
  };
  noticeForTheBuilding: {
    label: string;
    value: boolean;
  };
  noticeForTPCBill: {
    label: string;
    value: boolean;
  };
  electricNumberInfos: {
    number: string;
    price: string;
  }[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}
