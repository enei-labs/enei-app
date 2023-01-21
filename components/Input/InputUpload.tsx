import UploadIcon from '@mui/icons-material/Upload'
import type { StandardTextFieldProps } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import InputText from './InputText'

interface InputUploadProps extends StandardTextFieldProps {
  accept?: string
}

const style = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  input: {
    '& fieldset': {
      borderRight: '0',
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
    },
    '& .Mui-disabled.Mui-error fieldset': {
      borderColor: '#D32F2F',
    },
  },
  button: {
    minHeight: '53px',
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
  },
}

const InputUpload = React.forwardRef<HTMLInputElement, InputUploadProps>(function InputUpload(
  props,
  ref,
) {
  const { name, label, value, accept, required, helperText } = props

  const [fileName, setFileName] = useState<any>(value)

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const file = files && files[0]

    if (file) {
      setFileName({ id: file.name })
    }
  }

  return (
    <Box sx={style.container}>
      <InputText
        disabled
        sx={style.input}
        label={label}
        value={fileName?.id || ''}
        required={required}
        helperText={helperText}
        placeholder="upload required document"
      />
      <label htmlFor={name}>
        <input hidden type="file" id={name} ref={ref} accept={accept} onChange={handleChange} />
        <Button component="span" variant="outlined" endIcon={<UploadIcon />} sx={style.button}>
          Upload
        </Button>
      </label>
    </Box>
  )
})

export default InputUpload
