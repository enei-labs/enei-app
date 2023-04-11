import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { UserContract } from "@core/graphql/types";
import { useRouter } from "next/router";
import ContractBox, { ContractInfo } from "@components/ContractBox/ContractBox";

interface UserContractBoxProps {
  contract: UserContract;
}

function UserContractBox(props: UserContractBoxProps) {
  const { contract } = props;
  const router = useRouter();

  const contractInfos: ContractInfo[] = [
    {
      icon: MonetizationOnOutlinedIcon,
      name: "採購電價",
      content: contract.price,
      unit: "元/kW",
    },
    {
      icon: EventOutlinedIcon,
      name: "賣電年限",
      content: contract.salesPeriod,
    },
    {
      icon: TrendingUpOutlinedIcon,
      name: "預計最高採購上限（契約）",
      content: contract.upperLimit,
      unit: "kWh",
    },
    {
      icon: TrendingUpOutlinedIcon,
      name: "預計開始轉供綠電時間",
      content: "",
    },
    {
      icon: CreditCardOutlinedIcon,
      name: "預計最低採購下限（契約）",
      content: contract.lowerLimit,
      unit: "kWh",
    },
  ];

  return (
    <ContractBox
      onClickFn={() => router.push(`/industry/${contract.id}`)}
      title={`${contract.name}`}
      contractInfos={contractInfos}
    />
  );
}

export default UserContractBox;
