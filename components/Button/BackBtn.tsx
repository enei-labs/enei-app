import Link from '@components/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'

interface BackBtnProps {
  path: string
  title?: string
}

const style = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  button: [
    (theme: any) => ({
      minWidth: '40px',
      p: 0,
      border: `2px solid ${theme.palette.stroke.main}`,
      borderRadius: '100px',
    }),
  ],
}

const BackBtn: React.FC<BackBtnProps> = ({ path, title }) => {
  return (
    <Box sx={style.wrapper}>
      <Link href={path}>
        <Button variant="outlined" color="menu" sx={style.button}>
          <ArrowBackIcon />
        </Button>
      </Link>

      <Typography variant="h1">{title}</Typography>
    </Box>
  )
}

export default BackBtn
