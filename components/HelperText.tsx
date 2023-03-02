import { Box } from "@mui/material";

type HelperTextProps = {
  children?: React.ReactNode;
};

const styles = {
  helperText: {
    color: "#4BADD8",
    backgroundColor: "#F7FAFE",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: "19.88px",
    padding: "20px",
  },
} as const;

export default function HelperText(props: HelperTextProps) {
  const { children } = props;

  return <Box sx={styles.helperText}>{children}</Box>;
}
