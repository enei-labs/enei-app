import { Button } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import dynamic from "next/dynamic";
import { CompanyContract } from "@core/graphql/types";

const PowerPlantDialog = dynamic(() => import("./PowerPlantDialog"));

interface AddPowerPlantBtnProps {
  companyContract: CompanyContract;
}

const AddPowerPlantBtn = (props: AddPowerPlantBtnProps) => {
  const { companyContract } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        新增電廠
      </Button>

      {open ? (
        <PowerPlantDialog
          open={open}
          onClose={() => setOpen(false)}
          variant="create"
          companyContract={companyContract}
          defaultValues={{ transferRate: 100 }}
        />
      ) : null}
    </>
  );
};

export default AddPowerPlantBtn;
