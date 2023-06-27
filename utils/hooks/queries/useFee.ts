import { Fee } from '@core/graphql/types';
import useQuery from '../useQuery';
import { FEE } from '@core/graphql/queries';

export const useFee = () => {
  return useQuery<{ fee: Fee }>(FEE)
}
