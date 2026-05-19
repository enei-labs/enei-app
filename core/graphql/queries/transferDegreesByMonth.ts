import { gql } from '@apollo/client';

export const TRANSFER_DEGREES_BY_MONTH = gql`
  query TransferDegreesByMonth($year: Int!) {
    transferDegreesByMonth(year: $year)
  }
`;
