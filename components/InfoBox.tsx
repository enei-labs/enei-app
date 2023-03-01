import { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

interface InfoBoxProps {
  icon: SvgIconComponent;
  label: string;
  content: string | number;
  unit?: string;
}

function InfoBox(props: InfoBoxProps) {
  const { icon: Icon, label, content, unit } = props;
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Icon />
      <Box sx={{ ml: "12px" }}>
        <Typography variant="body4">label</Typography>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Typography variant="h6">{content}</Typography>
          {unit ? <Typography variant="body4">unit</Typography> : null}
        </Box>
      </Box>
    </Box>
  );
}

export default InfoBox;
