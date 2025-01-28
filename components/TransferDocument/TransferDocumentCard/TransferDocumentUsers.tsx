import { Box, Typography, Divider } from "@mui/material";
import type {
  TransferDocumentUser,
  User,
  UserContract,
} from "@core/graphql/types";

type TransferDocumentUsersItem = Pick<
  TransferDocumentUser,
  "monthlyTransferDegree" | "yearlyTransferDegree" | "electricNumberInfo"
> &
  Pick<User, "name"> &
  Pick<UserContract, "purchaseDegree">;

type TransferDocumentUsersItemView = {
  [key in keyof TransferDocumentUsersItem as `${key}Node`]: React.ReactNode;
};

const usersMappedLabels: Array<{
  key: keyof Omit<TransferDocumentUsersItemView, "name">;
  label: string;
}> = [
  {
    key: "electricNumberInfoNode",
    label: "電號",
  },
  {
    key: "purchaseDegreeNode",
    label: "預計年採購度數",
  },
  {
    key: "monthlyTransferDegreeNode",
    label: "月上限度數",
  },
  {
    key: "yearlyTransferDegreeNode",
    label: "年上限度數",
  },
];

interface TransferDocumentUsersProps {
  transferDocumentUsers: TransferDocumentUser[];
}

interface TransferDocumentUsersItemProps {
  transferDocumentUser: TransferDocumentUsersItemView;
}

function TransferDocumentUsersItem(props: TransferDocumentUsersItemProps) {
  const { transferDocumentUser } = props;

  return (
    <Box sx={{ p: "8px 12px" }}>
      {transferDocumentUser.nameNode}
      <Box sx={{ display: "flex" }}>
        {usersMappedLabels.map(({ key, label }) => (
          <Box sx={{ flexGrow: 1 }} key={key}>
            <Typography variant="body4">{label}</Typography>
            {transferDocumentUser[key]}
          </Box>
        ))}
      </Box>
      <Divider sx={{ margin: "8px 0" }} />
    </Box>
  );
}

function TransferDocumentUsers(props: TransferDocumentUsersProps) {
  const { transferDocumentUsers } = props;

  const transferDocumentUsersView = transferDocumentUsers
    .filter((el) => el.userContract)
    .map((el) => ({
      nameNode: (
        <Typography sx={{ m: "0 0 8px 0" }} variant="h5">
          {el.userContract?.name}
        </Typography>
      ),
      electricNumberInfoNode: (
        <Typography variant="body1">{el.electricNumberInfo?.number}</Typography>
      ),
      purchaseDegreeNode: (
        <Typography variant="body1">
          {el.userContract?.purchaseDegree}{" "}
          <Typography variant="body4">MWh</Typography>
        </Typography>
      ),
      monthlyTransferDegreeNode: (
        <Typography variant="body1">
          {el.userContract?.upperLimit}{" "}
          <Typography variant="body4">MWh</Typography>
        </Typography>
      ),
      yearlyTransferDegreeNode: (
        <Typography variant="body1">
          {el.userContract?.lowerLimit}{" "}
          <Typography variant="body4">MWh</Typography>
        </Typography>
      ),
    }));

  return (
    <Box
      sx={{
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: "8px",
        height: "258px",
      }}
    >
      {transferDocumentUsersView.map((item) => (
        <TransferDocumentUsersItem
          key={item.nameNode.props.children}
          transferDocumentUser={item}
        />
      ))}
    </Box>
  );
}

export default TransferDocumentUsers;
