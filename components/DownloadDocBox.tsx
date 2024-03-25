import { Box, Typography } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { IconBtn } from "./Button";
import { handleDownload } from "@utils/download";

const styles = {
  box: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    border: "2px solid #B2DFDB",
    borderRadius: "4px",
    height: "80px",
  },
  container: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    minHeight: "53px",
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0",
  },
};

interface DownloadDocBoxProps {
  fileId?: string | null;
  label: React.ReactNode;
}

const DownloadDocBox = (props: DownloadDocBoxProps) => {
  const { label, fileId } = props;

  return (
    <Box sx={styles.box}>
      <Typography variant="h6">{label}</Typography>
      <Box sx={styles.container}>
        <IconBtn
          tooltipText={fileId ? "下載檔案" : "檔案未上傳"}
          disabled={!fileId}
          icon={<FileDownloadOutlinedIcon />}
          onClick={() => {
            if (!fileId) return;
            handleDownload(fileId);
          }}
        />
      </Box>
    </Box>
  );
};

export default DownloadDocBox;
