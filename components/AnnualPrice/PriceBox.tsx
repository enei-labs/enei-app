import { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export interface PriceBoxProps {
  icon: SvgIconComponent;
  name: string;
  price: string;
  unit: string;
}

const styles = {
  box: {
    backgroundColor: "primary.light",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    height: 260,
  },
} as const;

export function PriceBox(props: PriceBoxProps) {
  const { icon: Icon, name, price, unit } = props;
  return (
    <Box>
      <Box sx={{ display: "flex", marginBottom: "10px" }}>
        <Icon />
        <Typography variant="body2">{name}</Typography>
      </Box>
      <Box sx={styles.box}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            margin: "40px",
            columnGap: "4px",
          }}
        >
          <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
            {new Intl.NumberFormat().format(Number(price))}
          </Typography>
          <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
            {unit}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
