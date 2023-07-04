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
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import InfoBox from "@components/InfoBox";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ProgressDialog from "@components/TransferDocument/TransferDocumentCard/ProgressDialog";
import { TransferDocument } from "@core/graphql/types";
import { useBackwardTransferDocumentStage } from "@utils/hooks";
import { LoadingButton } from "@mui/lab";
import { formatDateTime } from "@utils/format";

const steps = [
  "轉供計畫書送審",
  "取得轉供函覆文",
  "轉供契約送審",
  "轉供契約完成",
  "正式轉供日",
] as const;

type ProgressBarProps = {
  transferDocument: TransferDocument;
};

const getCurrentStep = (transferDocument: TransferDocument) => {
  if (transferDocument.officialTransferDate) {
    return 5;
  }

  if (transferDocument.contractCompletionDate) {
    return 4;
  }

  if (transferDocument.contractReviewDate) {
    return 3;
  }

  if (transferDocument.responseAcquisitionDate) {
    return 2;
  }

  if (transferDocument.planSubmissionDate) {
    return 1;
  }

  return 0;
};

const ProgressBar = ({ transferDocument }: ProgressBarProps) => {
  const [activeStep, setActiveStep] = useState(
    getCurrentStep(transferDocument)
  );
  const [shownDialog, showDialog] = useState(false);
  const [backward, loading] = useBackwardTransferDocumentStage(
    transferDocument.id
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length));
  };

  const handleBack = async () => {
    await backward();
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const getDate = (index: number) => {
    switch (index) {
      case 0:
        return formatDateTime(transferDocument.planSubmissionDate);
      case 1:
        return formatDateTime(transferDocument.responseAcquisitionDate);
      case 2:
        return formatDateTime(transferDocument.contractReviewDate);
      case 3:
        return formatDateTime(transferDocument.contractCompletionDate);
      case 4:
        return formatDateTime(transferDocument.officialTransferDate);
    }
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
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
            >
              倒退
            </LoadingButton>
            <Button
              variant="contained"
              color="primary"
              onClick={() => showDialog(true)}
              disabled={activeStep === steps.length}
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
        <InfoBox
          icon={EventNoteIcon}
          label="期望轉供日"
          content={formatDateTime(transferDocument.expectedTime)}
        />
      </Box>
      <Box padding="24px 8px" border={"2px solid #B2DFDB"} borderRadius="4px">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel icon=" ">
                {label}
                {getDate(index) && (
                  <Typography variant="caption" display="block">
                    {getDate(index)}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {shownDialog ? (
        <ProgressDialog
          transferDocumentId={transferDocument.id}
          handleNextFn={handleNext}
          onClose={() => showDialog(false)}
          open={shownDialog}
          showContractInput={activeStep === steps.length - 1}
        />
      ) : null}
    </Box>
  );
};

export default ProgressBar;
