export type FormData = {
  transferDocument: {
    label: string;
    value: string;
  };
  billNumber: string;
  billReceivedDate: Date;
  billingDate: Date;
  billDoc: {
    id: string;
    file: File;
  };
  transferDegrees: Record<
    string,
    {
      degree: number;
      fee: string;
      userContractId: string;
      userId: string;
    }
  >;
}