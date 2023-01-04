import { createTheme } from '@mui/material'
import componentsTheme from './componentsTheme'
import paletteTheme from './paletteTheme'
import typographyTheme from './typographyTheme'

const theme = createTheme({
  palette: paletteTheme.palette,
  typography: typographyTheme.typography,
  components: componentsTheme.components,
})

export default theme
