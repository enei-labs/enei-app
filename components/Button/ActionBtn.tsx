import Button from '@mui/material/Button'
import React from 'react'

interface ActionBtnProps {
  icon: React.ReactNode
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  border?: 'none' | 'circle'
  disabled?: boolean
  onClick?: () => void
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, color, border, disabled, onClick }) => {
  const props = { color, disabled, onClick }

  const style = {
    wrapper: {
      minWidth: '30px',
      minHeight: '30px',
      p: 0,
      borderRadius: border === 'circle' ? '100px' : '',
      '& svg': {
        fontSize: '16px',
      },
    },
  }

  return (
    <Button
      {...props}
      disableRipple={border === 'none'}
      variant={border === 'none' ? 'text' : 'outlined'}
      sx={style.wrapper}
    >
      {icon}
    </Button>
  )
}

export default ActionBtn
