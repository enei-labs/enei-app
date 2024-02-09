import { Box, Grid } from "@mui/material";
import { useUserContracts } from "@utils/hooks/queries";
import { User } from "@core/graphql/types";
import { InputSearch } from "../Input";
import { BasicSelect } from "../Select";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import UserContractBox from "@components/ContractBox/UserContractBox";
import { AddUserContractBtn } from "@components/UserContract/UserContractDialog/AddUserContractBtn";

interface UserContractPanelProps {
  user: User;
}

function UserContractPanel(props: UserContractPanelProps) {
  const { user } = props;
  const [state, setState] = useState("");
  const { data, loading } = useUserContracts({
    variables: { userId: user.id },
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "24px",
        }}
      >
        <Box sx={{ display: "flex", columnGap: "0.75em" }}>
          <InputSearch />
          <BasicSelect state={state} setState={setState} items={[]} />
        </Box>
        <AddUserContractBtn user={user} />
      </Box>
      <Grid container spacing={2} sx={{ mt: "24px" }}>
        {loading ? (
          <CircularProgress size="24px" />
        ) : data && data.userContracts.list.length !== 0 ? (
          data.userContracts.list.map((contract) => (
            <Grid item sm={4} key={contract.id}>
              <UserContractBox contract={contract} />
            </Grid>
          ))
        ) : (
          <Box sx={{ width: "100%", textAlign: "center" }}>沒有資料</Box>
        )}
      </Grid>
    </>
  );
}

export default UserContractPanel;
