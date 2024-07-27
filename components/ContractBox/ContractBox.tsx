import { Box, Grid, Typography } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
import EditUserContractBtn from "@components/UserContract/UserContractDialog/EditUserContractBtn";
import { User, UserContract } from "@core/graphql/types";

export type ContractInfo = {
  icon: SvgIconComponent;
  name: string;
  content: string | number;
  unit?: string;
};

interface ContractBoxProps {
  userContract?: UserContract;
  user?: User;
  onClickFn: VoidFunction;
  title: string;
  contractInfos: ContractInfo[];
  totalVolume?: number;
}

const styles = {
  box: {
    border: "2px solid #B2DFDB",
    borderRadius: "16px",
    padding: "16px",
    "&:hover": {
      cursor: "pointer",
      border: "2px solid #009688",
      boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.15)",
    },
  },
} as const;

function ContractBox(props: ContractBoxProps) {
  const { user, userContract, onClickFn, title, contractInfos, totalVolume } =
    props;

  return (
    <Box sx={styles.box} onClick={onClickFn}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">{title}</Typography>
        {userContract ? (
          <Box>
            <EditUserContractBtn userContract={userContract} user={user!} />
          </Box>
        ) : null}
      </Box>
      {/* @TODO check the logic here */}
      {totalVolume ? (
        <Typography variant="subtitle2">{`${new Intl.NumberFormat().format(totalVolume)}MWh`}</Typography>
      ) : null}
      <Grid container>
        {contractInfos.map((info) => {
          const { icon: Icon, name, content, unit } = info;
          return (
            <Grid item sm={6} key={info.name}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Icon />
                <Box sx={{ ml: "12px" }}>
                  <Typography variant="body4">{name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <Typography variant="h6">{content}</Typography>
                    {unit ? (
                      <Typography variant="body4">{unit}</Typography>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default ContractBox;
