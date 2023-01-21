import Box from '@mui/material/Box'
import type { Theme } from '@mui/material/styles'
import React from 'react'

interface FormBoxProps {
  children: React.ReactNode
}

const style = {
  container: [
    (theme: Theme) => ({
      display: 'grid',
      gap: '30px',
      maxWidth: '620px',
      p: '60px',
      m: 'auto',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      background: '#FFFFFF',
      [theme.breakpoints.down('md')]: {
        p: '30px',
      },
    }),
  ],
}

const FormBox: React.FC<FormBoxProps> = ({ children }) => {
  return <Box sx={style.container}>{children}</Box>
}

export default FormBox
