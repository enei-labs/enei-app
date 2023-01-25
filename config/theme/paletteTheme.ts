import { createTheme } from '@mui/material/styles'

const paletteTheme = createTheme({
  palette: {
    primary: {
      light: '#E0F2F1',
      main: '#4db6ac',
      dark: '#009688',
    },
    secondary: {
      main: '#4dd0e1',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: '#8bc34a',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    tertiary: {
      main: '#9DD0F0',
    },
    stroke: {
      main: '#DCDEDF',
    },
    reject: {
      main: '#E1125E',
    },
    menu: {
      main: '#818181',
    },
    bg: {
      main: '#FAFCFE',
    },
  },
})

declare module '@mui/material/styles' {
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary']
    stroke?: PaletteOptions['primary']
    reject?: PaletteOptions['primary']
    menu?: PaletteOptions['primary']
    bg?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true
    stroke: true
    reject: true
    menu: true
    bg: true
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    tertiary: true
    stroke: true
    reject: true
    menu: true
    bg: true
  }
}

export default paletteTheme
