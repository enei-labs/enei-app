import { IconBtn } from '@components/Button'
import Dialog from '@components/Dialog'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { Stack, Typography } from '@mui/material'
import { useState } from 'react'

const NotesBtn = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconBtn icon={<DescriptionOutlinedIcon />} onClick={() => setOpen(true)} />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Stack gap="10px">
          <Typography variant="h1">Notes</Typography>
          <Typography variant="subtitle1">for internal records and communications</Typography>
        </Stack>
      </Dialog>
    </>
  )
}

export default NotesBtn
