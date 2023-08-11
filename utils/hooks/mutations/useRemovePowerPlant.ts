import { PowerPlant } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_POWER_PLANT } from '@core/graphql/mutations/removePowerPlant';
import { POWER_PLANTS } from '@core/graphql/queries';

export const useRemovePowerPlant = () => {
  return useMutation<{ removePowerPlant: PowerPlant }, { id: string }>(
    REMOVE_POWER_PLANT, {
      /** @need refactor */
      refetchQueries: [POWER_PLANTS]
    }
  )
}
