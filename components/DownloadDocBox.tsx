import { Box, Typography, Tooltip } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { IconBtn } from "./Button";
import { handleDownload } from "@utils/download";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const getSignedUrl = async (fileId: string, action: 'upload' | 'download' = 'download') => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/s3/getSignedUrl/${action}`, {
      params: { fileId },
      withCredentials: true,
    });
    return data.signedUrl;
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    throw new Error("Failed to get URL");
  }
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
  fileId?: string | null;
  fileName?: string | null;
  label: React.ReactNode;
}

// File preview component for downloaded files
const FilePreview: React.FC<{ fileId: string; fileName: string }> = ({ fileId, fileName }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get file extension and determine file type
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const extension = getFileExtension(fileName);
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
  const isPDF = extension === 'pdf';
  
  // Fetch image from S3 if it's an image
  React.useEffect(() => {
    if (isImage && fileId) {
      setLoading(true);
      getSignedUrl(fileId, 'download')
        .then(url => {
          setImageUrl(url);
        })
        .catch(error => {
          console.error('Failed to get image URL:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isImage, fileId]);

  if (isImage) {
    return (
      <Box sx={{ maxWidth: 200, p: 1 }}>
        {loading ? (
          <Box sx={{ 
            width: '100%', 
            height: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius: 1
          }}>
            <Typography variant="caption" color="text.secondary">
              載入中...
            </Typography>
          </Box>
        ) : imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={fileName}
            width={300}
            height={150}
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: 150,
              borderRadius: 4,
              objectFit: 'contain'
            }}
            onError={(e) => {
              console.error('Image failed to load:', e);
              // Hide broken image
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Box sx={{ 
            width: '100%', 
            height: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius: 1
          }}>
            <ImageIcon color="disabled" sx={{ fontSize: 40 }} />
          </Box>
        )}
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          {fileName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          類型: 圖片文件
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 250, p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {isPDF ? (
          <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
        ) : (
          <DescriptionIcon color="action" sx={{ mr: 1 }} />
        )}
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {fileName}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        類型: {isPDF ? 'PDF 文件' : '文檔文件'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        文件 ID: {fileId.substring(0, 8)}...
      </Typography>
    </Box>
  );
};

const DownloadDocBox = (props: DownloadDocBoxProps) => {
  const { label, fileId, fileName } = props;

  // Render file name with preview tooltip
  const renderFileName = () => {
    if (!fileName || !fileId) {
      return <Typography variant="body2">{fileName || "未上傳檔案"}</Typography>;
    }

    return (
      <Tooltip 
        title={<FilePreview fileId={fileId} fileName={fileName} />}
        placement="top"
        arrow
        enterDelay={300}
        leaveDelay={200}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiTooltip-arrow': {
                color: 'background.paper',
                '&::before': {
                  border: '1px solid',
                  borderColor: 'divider',
                },
              },
            },
          },
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          {fileName}
        </Typography>
      </Tooltip>
    );
  };

  return (
    <Box sx={styles.box}>
      <Typography variant="h6" sx={{ minWidth: "200px", flex: "0 0 200px" }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        {renderFileName()}
      </Box>
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
