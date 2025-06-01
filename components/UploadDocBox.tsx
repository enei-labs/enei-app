import { Box, StandardTextFieldProps, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useRequest } from "ahooks";
import axios from "axios";
import { IconBtn } from "./Button";
import { toast } from "react-toastify";
import React, { useState, useCallback, useRef } from "react";
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

const getSignedUrl = async (fileId: string) => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/s3/getSignedUrl/upload`, {
      params: { fileId },
      withCredentials: true,
    });
    return data.signedUrl;
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    throw new Error("Failed to get upload URL");
  }
};

const uploadFile = async (file: File) => {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const fileId = crypto.randomUUID();
  const signedUrl = await getSignedUrl(fileId);
  
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

    return (
      <Box sx={styles.box}>
        <Typography variant="h6">{label}</Typography>
        <Box sx={styles.container}>
          <Typography variant="body2" title={currentFileName}>
            {currentFileName}
          </Typography>
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
