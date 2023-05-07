import { CreateTransferDegreeInput } from "@core/graphql/types";

export type FormData = {
  transferDocument: {
    label: string;
    value: string;
  };
  billReceivedDate: Date;
  billDoc: {
    id: string;
    file: File;
  };
  transferDegrees: Record<string, string>;
}