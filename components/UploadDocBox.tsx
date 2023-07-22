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

interface UploadDocBoxProps extends StandardTextFieldProps {
  accept?: string;
  onChange: (document: any) => void;
  label: React.ReactNode;
}

// @TODO delete function
const UploadDocBox = React.forwardRef<HTMLInputElement, UploadDocBoxProps>(
  function InputUpload(props, ref) {
    const { name, label, value, accept, required, onChange } = props;

    const { runAsync, loading } = useRequest(uploadFile, {
      manual: true,
      onError: (error: any) => {
        toast.error(error.message);
      },
    });

    const [fileName, setFileName] = useState<any>(value);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const file = files && files[0];

      if (file) {
        const data = await runAsync(file);
        onChange({ id: data?.id, file: file });
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
            onClick={() => console.log("delete")}
          />
        </Box>
      </Box>
    );
  }
);

export default UploadDocBox;
