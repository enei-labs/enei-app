export type FormData = {
  name: string;
  number: string;
  receptionAreas: string;
  expectedTime: Date;
  printingDoc: { id: string; file: File };
  replyDoc: { id: string; file: File };
  wordDoc: { id: string; file: File };
  formalDoc: { id: string; file: File };
  transferDocumentPowerPlants: {
    estimateAnnualSupply: number;
    powerPlant: {
      label: string;
      value: string;
    };
    transferRate: number;
  }[];
  transferDocumentUsers: {
    expectedYearlyPurchaseDegree: number;
    monthlyTransferDegree: number;
    user: {
      label: string;
      value: string;
    };
    userContract: {
      label: string;
      value: string;
    }
    yearlyTransferDegree: number;
  }[];
};
