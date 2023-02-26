import { Role } from "@core/graphql/types";

export type FormData = {
  name: string;
  email: string;
  role: {
    label: string;
    value: Role;
  };
  companyId?: {
    label: string;
    value: string;
  };
  userId?: {
    label: string;
    value: string;
  };
};
