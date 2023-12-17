import { PowerPlant, PowerPlantPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_POWER_PLANT } from '@core/graphql/mutations/removePowerPlant';
import { POWER_PLANTS } from '@core/graphql/queries';

export const useRemovePowerPlant = () => {
  return useMutation<{ removePowerPlant: PowerPlant }, { id: string }>(
    REMOVE_POWER_PLANT, {
      update(cache, { data }) {
        if (data?.removePowerPlant?.__typename === 'PowerPlant') {
          const existingPowerPlants = cache.readQuery<{ powerPlants: PowerPlantPage }>({ query: POWER_PLANTS });

          if (existingPowerPlants) {
            cache.writeQuery({
              query: POWER_PLANTS,
              data: {
                powerPlants: {
                  ...existingPowerPlants.powerPlants,
                  total: existingPowerPlants.powerPlants.total - 1,
                  list: existingPowerPlants.powerPlants.list.filter(user => user.id !== data.removePowerPlant.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
