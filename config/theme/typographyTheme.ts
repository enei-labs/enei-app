import { createTheme } from '@mui/material/styles'

const breakpoints = createTheme().breakpoints

const typographyTheme = createTheme({
  typography: {
    h1: {
      color: 'black',
      fontSize: '32px',
      fontWeight: 'bold',
      [breakpoints.down('md')]: {
        fontSize: '24px',
      },
    },
    h3: {
      wordBreak: 'break-all',
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
      color: 'text.secondary',
      fontSize: '16px',
      fontWeight: 400,
      wordBreak: 'break-all',
    },
    body3: {
      color: 'text.secondary',
      fontSize: '14px',
      fontWeight: 400,
    },
    body4: {
      color: 'text.secondary',
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
