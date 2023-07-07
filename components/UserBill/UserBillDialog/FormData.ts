import { ChargeType } from "@core/graphql/types";

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
  transportationFee: ChargeType;
  credentialInspectionFee: ChargeType;
  credentialServiceFee: ChargeType;
  noticeForTheBuilding: boolean;
  noticeForTPCBill: boolean;
  electricNumberInfos: {
    number: string;
    price: string;
  }[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
}
