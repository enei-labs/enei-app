export type FormData = {
  transferDocument: {
    label: string;
    value: string;
  };
  billReceivedDate: Date;
  billDoc: string;
  transferDegrees: Record<string, string>;
}