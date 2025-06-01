import { Box, StandardTextFieldProps, Typography, Tooltip } from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useRequest } from "ahooks";
import axios from "axios";
import { IconBtn } from "./Button";
import { toast } from "react-toastify";
import React, { useState, useCallback, useRef, useMemo } from "react";
import { LoadingButton } from "@mui/lab";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// File size limit (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// const uploadFile = async (file: File) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const { data } = await axios.post(`${apiBaseUrl}/s3/upload`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//     withCredentials: true,
//   });

//   return data;
// };

const getSignedUrl = async (fileId: string, action: 'upload' | 'download' = 'upload') => {
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

const uploadFile = async (file: File) => {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const fileId = crypto.randomUUID();
  const signedUrl = await getSignedUrl(fileId, 'upload');
  
  if (!signedUrl) {
    throw new Error("Failed to get signed URL");
  }

  try {
    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return { success: true, fileId };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

const deleteFile = async (fileId: string) => {
  const { data } = await axios.delete(
    `${apiBaseUrl}/s3/delete?fileId=${fileId}`,
    {
      withCredentials: true,
    }
  );

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
  input: {
    "& fieldset": {
      border: "none",
    },
    "& .Mui-disabled.Mui-error fieldset": {
      borderColor: "#D32F2F",
    },
  },
  button: {
    minHeight: "53px",
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0",
  },
};

interface DocumentValue {
  id: string;
  file: File;
}

interface UploadDocBoxProps
  extends Omit<StandardTextFieldProps, "onChange" | "value"> {
  accept?: string;
  value?: DocumentValue;
  onChange: (document: DocumentValue | null) => void;
  label: React.ReactNode;
}

// File preview component
const FilePreview: React.FC<{ file: File; fileId?: string }> = ({ file, fileId }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch image from S3 if fileId is provided and it's an image
  React.useEffect(() => {
    if (isImage && fileId) {
      setLoading(true);
      getSignedUrl(fileId, 'download')
        .then(url => {
          setImageUrl(url);
        })
        .catch(error => {
          console.error('Failed to get image URL:', error);
          // Fallback to local blob URL
          const blobUrl = URL.createObjectURL(file);
          setImageUrl(blobUrl);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (isImage) {
      // Use local blob URL for files not yet uploaded
      const blobUrl = URL.createObjectURL(file);
      setImageUrl(blobUrl);
      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    }
  }, [isImage, fileId, file]);

  // Clean up blob URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

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
          <img 
            src={imageUrl} 
            alt={file.name}
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
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatFileSize(file.size)}
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
          {file.name}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        大小: {formatFileSize(file.size)}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        類型: {file.type || '未知'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        最後修改: {new Date(file.lastModified).toLocaleDateString()}
      </Typography>
    </Box>
  );
};

const UploadDocBox = React.forwardRef<HTMLInputElement, UploadDocBoxProps>(
  function InputUpload(props, ref) {
    const { name, label, value, accept, required, onChange } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { runAsync, loading } = useRequest(uploadFile, {
      manual: true,
      onSuccess: () => toast.success("上傳成功"),
      onError: (error: any) => {
        toast.error(error.message || "Upload failed");
      },
    });

    const { runAsync: deleteFn, loading: deleteLoading } = useRequest(
      deleteFile,
      {
        manual: true,
        onSuccess: () => {
          toast.success("刪除成功");
          onChange(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        onError: (error: any) => {
          toast.error(error.message || "Delete failed");
        },
      }
    );

    const handleChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const file = files && files[0];

      if (file) {
        try {
          const data = await runAsync(file);
          onChange({ id: data.fileId, file: file });
        } catch (error) {
          // Error is already handled by useRequest onError
          // Reset the input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }
    }, [runAsync, onChange]);

    const handleDelete = useCallback(() => {
      if (value?.id) {
        deleteFn(value.id);
      }
    }, [value?.id, deleteFn]);

    const currentFileName = value?.file?.name || "";
    const hasFile = Boolean(currentFileName);

    // Render file name with preview tooltip
    const renderFileName = () => {
      if (!hasFile || !value?.file) {
        return <Typography variant="body2">{currentFileName}</Typography>;
      }

      return (
        <Tooltip 
          title={<FilePreview file={value.file} fileId={value.id} />}
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
            {currentFileName}
          </Typography>
        </Tooltip>
      );
    };

    return (
      <Box sx={styles.box}>
        <Typography variant="h6">{label}</Typography>
        <Box sx={styles.container}>
          {renderFileName()}
          <label htmlFor={name}>
            <input
              hidden
              type="file"
              id={name}
              ref={fileInputRef}
              accept={accept || ".png, .jpg, .gif, .pdf"}
              onChange={handleChange}
            />
            <LoadingButton
              sx={{ border: "none", "&:hover": { border: "none" } }}
              component="span"
              variant="outlined"
              loading={loading}
              endIcon={<UploadIcon />}
              aria-label="Upload file"
            ></LoadingButton>
          </label>
          <IconBtn
            icon={<DeleteOutlinedIcon />}
            onClick={handleDelete}
            disabled={!hasFile || deleteLoading}
            aria-label="Delete file"
          />
        </Box>
      </Box>
    );
  }
);

export default UploadDocBox;
