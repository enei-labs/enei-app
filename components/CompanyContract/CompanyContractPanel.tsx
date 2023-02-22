import { Box, Card, Grid, Typography } from "@mui/material";
import { useCompanyContracts } from "@utils/hooks/queries";
import { Company } from "@core/graphql/types";
import ContractBox from "../ContractBox";
import { InputSearch } from "../Input";
import AddCompanyContractBtn from "./AddCompanyContractBtn";

interface CompanyControlPanelProps {
  company: Company;
}

export function CompanyContractPanel(props: CompanyControlPanelProps) {
  const { company } = props;
  const { data, loading } = useCompanyContracts({ companyId: company.id });
  return (
    <Card sx={{ p: "36px" }}>
      <Typography variant="h4">再生能源股份有限公司2</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "24px",
        }}
      >
        <Box sx={{ display: "flex", columnGap: "0.75em" }}>
          <InputSearch />
          {/* <BasicSelect state={state} setState={setState} items={[]} /> */}
        </Box>
        <AddCompanyContractBtn company={company} />
      </Box>
      <Grid container spacing={2} sx={{ mt: "24px" }}>
        {loading ? (
          "loading"
        ) : data && data.companyContracts.list.length !== 0 ? (
          data.companyContracts.list.map((contract) => (
            <Grid item sm={4} key={contract.id}>
              <ContractBox title={contract.name} subtitle="3,000MWh" />
            </Grid>
          ))
        ) : (
          <Box sx={{ width: "100%", textAlign: "center" }}>沒有資料</Box>
        )}
      </Grid>
    </Card>
  );
}
