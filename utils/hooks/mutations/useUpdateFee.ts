import { Fee, UpdateFeeInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { UPDATE_FEE } from '@core/graphql/mutations';
import { FEE } from '@core/graphql/queries';

export const useUpdateFee = () => {
  return useMutation<{ updateFee: Fee }, { input: UpdateFeeInput }>(
    UPDATE_FEE, {
      /** @need refactor */
      refetchQueries: [FEE]
    }
  )
}
