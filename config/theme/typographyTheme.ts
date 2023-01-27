import { createTheme } from '@mui/material/styles'
import paletteTheme from './paletteTheme'

const { palette } = paletteTheme as any
const breakpoints = createTheme().breakpoints

const typographyTheme = createTheme({
  typography: {
    h1: {
      fontSize: '64px',
      fontWeight: 500,
    },
    h2: {
      fontSize: '48px',
      fontWeight: 900,
    },
    h3: {
      fontSize: '36px',
      fontWeight: 700,
      wordBreak: 'break-all',
    },
    h4: {
      fontSize: '24px',
      fontWeight: 700,
    },
    h5: {
      fontSize: '20px',
      fontWeight: 700,
    },
    h6: {
      fontSize: '16px',
      fontWeight: 700,
    },
    title: {
      color: 'black',
      fontSize: '32px',
      fontWeight: 'bold',
      [breakpoints.down('md')]: {
        fontSize: '24px',
      },
    },
    subtitle1: {
      fontSize: '16px',
      fontWeight: 'bold',
      [breakpoints.down('md')]: {
        fontSize: '14px',
      },
    },
    subtitle2: {
      fontSize: '14px',
      fontWeight: 700,
    },
    body1: {
      fontSize: '20px',
      fontWeight: 500,
      wordBreak: 'break-all',
    },
    body2: {
      color: palette.text.secondary,
      fontSize: '16px',
      fontWeight: 400,
      wordBreak: 'break-all',
    },
    body3: {
      color: palette.text.secondary,
      fontSize: '14px',
      fontWeight: 400,
    },
    body4: {
      color: palette.text.secondary,
      fontSize: '12px',
      fontWeight: 400,
    },
    button: {
      fontWeight: 'bold',
      textTransform: 'none',
    },
    note: {
      fontSize: '10px',
      lineHeight: 1.4,
    },
    hint: {
      display: 'block',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5,
      textAlign: 'justify',
    },
    menuType: {
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.1rem',
    },
    menuItem: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '1.5',
    },
  },
})

declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: React.CSSProperties
    body4: React.CSSProperties
    title: React.CSSProperties
    note: React.CSSProperties
    hint: React.CSSProperties
    menuType: React.CSSProperties
    menuItem: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties
    body4?: React.CSSProperties
    title?: React.CSSProperties
    note?: React.CSSProperties
    hint?: React.CSSProperties
    menuType?: React.CSSProperties
    menuItem?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true
    body4: true
    title: true
    note: true
    hint: true
    menuType: true
    menuItem: true
  }
}

export default typographyTheme
