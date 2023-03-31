export type FormData = {
  name: string;
  receptionAreas: string;
  expectedTime: Date;
  printingDoc: string;
  replyDoc: string;
  wordDoc: string;
  formalDoc: string;
  transferDocumentPowerPlants: {
    estimateAnnualSupply: number;
    powerPlant: {
      label: string;
      value: string;
    };
    transferRate: number;
  }[];
  transferDocumentUsers: {
    monthlyTransferDegree: number;
    user: {
      label: string;
      value: string;
    };
    yearlyTransferDegree: number;
  }[];
};
