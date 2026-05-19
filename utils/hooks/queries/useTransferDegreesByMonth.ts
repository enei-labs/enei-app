import { TRANSFER_DEGREES_BY_MONTH } from '@core/graphql/queries';
import useQuery from '../useQuery';

interface Variables {
  year: number;
}

export const useTransferDegreesByMonth = (variables: Variables) => {
  return useQuery(TRANSFER_DEGREES_BY_MONTH, { variables });
};
