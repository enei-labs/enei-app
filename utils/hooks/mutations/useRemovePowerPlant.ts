import { PowerPlant, PowerPlantPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_POWER_PLANT } from '@core/graphql/mutations/removePowerPlant';
import { POWER_PLANTS } from '@core/graphql/queries';

export const useRemovePowerPlant = (companyContractId: string) => {
  return useMutation<{ removePowerPlant: PowerPlant }, { id: string }>(
    REMOVE_POWER_PLANT, {
      update(cache, { data }) {
        if (data?.removePowerPlant) {
          // Directly evict the power plant from the cache
          cache.evict({ id: cache.identify(data.removePowerPlant) });
          // Garbage collect any unreferenced objects
          cache.gc();
        }
      },
    }
  )
}
