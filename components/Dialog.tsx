import type { DialogProps } from "@mui/material/Dialog";
import MuiDialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import React from "react";

const Dialog: React.FC<DialogProps> = ({
  maxWidth = "sm",
  open,
  onClose,
  children,
}) => {
  return (
    <MuiDialog fullWidth maxWidth={maxWidth} open={open} onClose={onClose}>
      <DialogContent>
        <Stack gap="30px">{children}</Stack>
      </DialogContent>
    </MuiDialog>
  );
};

export default Dialog;
