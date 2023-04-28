import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { ArrowBack, ArrowForward, Replay } from "@mui/icons-material";
import InfoBox from "@components/InfoBox";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ProgressDialog from "@components/TransferDocument/TransferDocumentCard/ProgressDialog";

const steps = [
  "轉供計畫書送審",
  "取得轉供函覆文",
  "轉供契約送審",
  "轉供契約完成",
  "正式轉供日",
] as const;

const ProgressBar: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [dates, setDates] = useState<string[]>(Array(steps.length).fill(""));
  const [shownDialog, showDialog] = useState(false);

  const handleNext = () => {
    const newDates = [...dates];
    newDates[activeStep] = new Date().toLocaleDateString();
    setDates(newDates);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box display={"flex"} flexDirection={"column"} rowGap={"8px"}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="flex-start"
        marginTop="16px"
      >
        <Typography sx={{ margin: "0 0 24px 0" }} variant="h5">
          轉供申請進度
        </Typography>
        <Grid item>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
            >
              倒退
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => showDialog(true)}
              disabled={activeStep === steps.length - 1}
              endIcon={<ArrowForward sx={{ color: "white" }} />}
            >
              進展
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Box display="flex" columnGap="16px" justifyContent="flex-start">
        <InfoBox
          icon={LocationOnIcon}
          label="受理台電區處"
          content="台北西處"
        />
        <InfoBox icon={EventNoteIcon} label="期望轉供日" content="2020.12.21" />
      </Box>
      <Box padding="24px 8px" border={"2px solid #B2DFDB"} borderRadius="4px">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel icon=" ">
                {label}
                {dates[index] && (
                  <Typography variant="caption" display="block">
                    {dates[index]}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {shownDialog ? (
        <ProgressDialog
          handleNextFn={handleNext}
          onClose={() => showDialog(false)}
          open={shownDialog}
          showContractInput
        />
      ) : null}
    </Box>
  );
};

export default ProgressBar;
