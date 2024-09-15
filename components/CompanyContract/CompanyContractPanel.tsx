import { Box, Card, Grid, Typography } from "@mui/material";
import { useCompanyContracts } from "@utils/hooks/queries";
import { Company } from "@core/graphql/types";
import { InputSearch } from "../Input";
import AddCompanyContractBtn from "./CompanyContractDialog/AddCompanyContractBtn";
import { BasicSelect } from "../Select";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CompanyContractBox from "@components/ContractBox/CompanyContractBox";

interface CompanyContractPanelProps {
  company: Company;
}

function CompanyContractPanel(props: CompanyContractPanelProps) {
  const { company } = props;
  const [state, setState] = useState("");
  const { data, loading } = useCompanyContracts({ variables: { companyId: company.id }});
  return (
    <Card sx={{ p: "36px" }}>
      <Typography variant="h4">{company.name}</Typography>
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
        <AddCompanyContractBtn company={company} />
      </Box>
      <Grid container spacing={2} sx={{ mt: "24px" }}>
        {loading ? (
          <CircularProgress size="24px" />
        ) : data && data.companyContracts.list.length !== 0 ? (
          data.companyContracts.list.map((contract) => (
            <Grid item sm={4} key={contract.id}>
              <CompanyContractBox contract={contract} />
            </Grid>
          ))
        ) : (
          <Box sx={{ width: "100%", textAlign: "center" }}>沒有資料</Box>
        )}
      </Grid>
    </Card>
  );
}

export default CompanyContractPanel;
