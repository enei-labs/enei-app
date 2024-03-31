import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { CompanyContract, RateType } from "@core/graphql/types";
import { formatDateTime } from "@utils/format";
import { useRouter } from "next/router";
import ContractBox, { ContractInfo } from "@components/ContractBox/ContractBox";
import { useMemo } from "react";
import BoltIcon from "@mui/icons-material/BoltOutlined";

interface CompanyContractBoxProps {
  contract: CompanyContract;
}

function CompanyContractBox(props: CompanyContractBoxProps) {
  const { contract } = props;
  const router = useRouter();
  const isSingleRate = contract.rateType === RateType.Single;
  const totalSupplyVolume = useMemo(
    () =>
      (contract.powerPlants ?? []).reduce((acc, cur) => {
        return acc + cur.supplyVolume;
      }, 0),
    [contract.powerPlants]
  );

  const contractInfos: ContractInfo[] = [
    {
      icon: BoltIcon,
      name: "裝置量",
      content: totalSupplyVolume,
      unit: " MW",
    },
    {
      icon: MonetizationOnOutlinedIcon,
      name: "合約價格",
      content: isSingleRate ? "各別費率" : contract.price ?? "N/A",
      unit: isSingleRate ? "" : "元/kW",
    },
    {
      icon: EventOutlinedIcon,
      name: "合約起始日期",
      content: formatDateTime(contract.startedAt),
    },
    {
      icon: TrendingUpOutlinedIcon,
      name: "轉供率要求",
      content: contract.transferRate,
      unit: "%",
    },
    {
      icon: TrendingUpOutlinedIcon,
      name: "正式轉供日",
      content: contract.officialTransferDate
        ? formatDateTime(contract.officialTransferDate)
        : "N/A",
    },
    {
      icon: CreditCardOutlinedIcon,
      name: "付款條件",
      content: contract.daysToPay,
      unit: "天",
    },
    {
      icon: TrendingUpOutlinedIcon,
      name: "合約結束日期",
      content: formatDateTime(contract.endedAt),
    },
    {
      icon: AccessTimeOutlinedIcon,
      name: "合約年限",
      content: contract.duration ?? "N/A",
      unit: "年",
    },
  ];

  return (
    <ContractBox
      onClickFn={() => router.push(`/industry/${contract.id}`)}
      title={`${contract.number}(${contract.name})`}
      totalVolume={contract.totalVolume}
      contractInfos={contractInfos}
    />
  );
}

export default CompanyContractBox;
