import { Box, StandardTextFieldProps, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useRequest } from "ahooks";
import axios from "axios";
import { IconBtn } from "./Button";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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
    const { data } = await axios.get(`${apiBaseUrl}/s3/getSignedUrl`, {
      params: { fileId },
    });
    return data.signedUrl;
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    return null;
  }
};

const uploadFile = async (file: File) => {
  const fileId = crypto.randomUUID();
  const signedUrl = await getSignedUrl(fileId);

  await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
    withCredentials: true,
  });

  return { success: true, fileId };
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

    const { runAsync, loading } = useRequest(uploadFile, {
      manual: true,
      onSuccess: () => toast.success("上傳成功"),
      onError: (error: any) => {
        toast.error(error.message);
      },
    });

    const { runAsync: deleteFn, loading: deleteLoading } = useRequest(
      deleteFile,
      {
        manual: true,
        onSuccess: () => {
          toast.success("刪除成功");
          setFileName(null);
          onChange(null);
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );

    const [fileName, setFileName] = useState<any>(value);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const file = files && files[0];

      if (file) {
        const data = await runAsync(file);
        onChange({ id: data.fileId, file: file });
        setFileName({ id: file.name });
      }
    };

    return (
      <Box sx={styles.box}>
        <Typography variant="h6">{label}</Typography>
        <Box sx={styles.container}>
          <Typography variant="body2">{fileName?.id || ""}</Typography>
          <label htmlFor={name}>
            <input
              hidden
              type="file"
              id={name}
              ref={ref}
              accept={accept || ".png, .jpg, .gif, .pdf"}
              onChange={handleChange}
            />
            <LoadingButton
              sx={{ border: "none", "&:hover": { border: "none" } }}
              component="span"
              variant="outlined"
              loading={loading}
              endIcon={<UploadIcon />}
            ></LoadingButton>
          </label>
          <IconBtn
            icon={<DeleteOutlinedIcon />}
            onClick={() => value?.id && deleteFn(value.id)}
            disabled={!fileName || !value || deleteLoading}
          />
        </Box>
      </Box>
    );
  }
);

export default UploadDocBox;
