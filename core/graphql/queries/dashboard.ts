import { gql } from '@apollo/client'
import { DASHBOARD_FIELDS } from '../fragment'

export const DASHBOARD = gql`
  ${DASHBOARD_FIELDS}
  query dashboard {
    dashboard {
      ...dashboardFields
    }
  }
`
