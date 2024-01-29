import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { CompanyContract } from "@core/graphql/types";
import { formatDateTime } from "@utils/format";
import { useRouter } from "next/router";
import ContractBox, { ContractInfo } from "@components/ContractBox/ContractBox";

interface CompanyContractBoxProps {
  contract: CompanyContract;
}

function CompanyContractBox(props: CompanyContractBoxProps) {
  const { contract } = props;
  const router = useRouter();

  const contractInfos: ContractInfo[] = [
    {
      icon: MonetizationOnOutlinedIcon,
      name: "合約價格",
      content: contract.price ?? "N/A",
      unit: "元/kW",
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
      content: formatDateTime(contract.transferAt),
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
      content: contract.duration,
      unit: "年",
    },
  ];

  return (
    <ContractBox
      onClickFn={() => router.push(`/industry/${contract.id}`)}
      title={`${contract.number}(${contract.name})`}
      contractInfos={contractInfos}
    />
  );
}

export default CompanyContractBox;
