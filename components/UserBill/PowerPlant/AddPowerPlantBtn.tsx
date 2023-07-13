import { Button } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import dynamic from "next/dynamic";

const PowerPlantDialog = dynamic(() => import("./PowerPlantDialog"));

interface AddPowerPlantBtnProps {
  companyContractId: string;
}

const AddPowerPlantBtn = (props: AddPowerPlantBtnProps) => {
  const { companyContractId } = props;
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
          companyContractId={companyContractId}
        />
      ) : null}
    </>
  );
};

export default AddPowerPlantBtn;
