import { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export interface BasicInfoProps {
  icon: SvgIconComponent;
  name: string;
  count: number;
  unit: string;
}

export function BasicInfo(props: BasicInfoProps) {
  const { icon: Icon, name, count, unit } = props;
  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      <Box
        width="48px"
        height="48px"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Icon />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body3">{name}</Typography>
        <Box sx={{ display: "flex", alignItems: "flex-end", columnGap: "4px" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {new Intl.NumberFormat().format(count)}
          </Typography>
          <Typography variant="body4">{unit}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
