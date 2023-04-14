import { Box, Typography } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { IconBtn } from "./Button";
import React from "react";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(`${apiBaseUrl}/s3/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return data;
};

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
  fileId: string;
  label: React.ReactNode;
}

const DownloadDocBox = (props: DownloadDocBoxProps) => {
  const { label, fileId } = props;

  const handleDownload = async () => {
    const response = await axios.get<{ signedUrl: string }>(
      `${apiBaseUrl}/s3/getSignedUrl?fileId=${fileId}`
    );
    const { signedUrl } = response.data;

    const link = document.createElement("a");
    link.href = signedUrl;
    link.target = "_blank";
    link.download = fileId;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={styles.box}>
      <Typography variant="h6">{label}</Typography>
      <Box sx={styles.container}>
        <IconBtn icon={<FileDownloadOutlinedIcon />} onClick={handleDownload} />
      </Box>
    </Box>
  );
};

export default DownloadDocBox;
