import { IconBtn } from '@components/Button'
import Dialog from '@components/Dialog'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Stack, Typography } from '@mui/material'
import { useState } from 'react'

interface DetailsBtnProps {
  title?: string
  subtitle?: string
}

const DetailsBtn: React.FC<DetailsBtnProps> = ({ title = 'Details', subtitle }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconBtn icon={<VisibilityIcon />} onClick={() => setOpen(true)} />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Stack gap="10px">
          <Typography variant="h1">{title}</Typography>
          <Typography variant="subtitle1">{subtitle}</Typography>
        </Stack>
      </Dialog>
    </>
  )
}

export default DetailsBtn
