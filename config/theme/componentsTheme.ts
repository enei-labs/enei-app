import { createTheme } from '@mui/material/styles'
import paletteTheme from './paletteTheme'

const { palette } = paletteTheme as any

const breakpoints = createTheme().breakpoints

const componentsTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.15)',
          borderRadius: '16px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '40px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&.MuiButton-text': {
            width: 'fit-content',
            minHeight: 'fit-content',
            padding: 0,
          },
          '&.MuiButton-text:hover': {
            backgroundColor: 'transparent',
          },
          '&.MuiButton-containedPrimary': {
            color: 'white',
          },
          '&.MuiButton-outlinedSecondary': {
            border: `1px solid ${palette.secondary.main}`,
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '.Mui-disabled': {
            cursor: 'not-allowed',
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '60px',
          textAlign: 'center',
          [breakpoints.down('md')]: {
            padding: '30px',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          '& .MuiTablePagination-selectLabel': {
            fontSize: '14px',
          },
          '& .MuiTablePagination-displayedRows': {
            fontSize: '14px',
          },
        },
      },
    },
  },
})

export default componentsTheme
