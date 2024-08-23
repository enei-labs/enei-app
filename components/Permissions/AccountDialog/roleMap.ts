import { Role } from "@core/graphql/types";

export const roleMap = {
  [Role.User]: "綠電用戶",
  [Role.Company]: "發電業",
  [Role.Admin]: "管理員",
  [Role.SuperAdmin]: "超級管理員",
};