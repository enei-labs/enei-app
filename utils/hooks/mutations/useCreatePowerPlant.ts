import { CreatePowerPlantInput, PowerPlant, PowerPlantPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_POWER_PLANT } from '@core/graphql/mutations';
import { POWER_PLANTS } from '@core/graphql/queries';

export const useCreatePowerPlant = () => {
  return useMutation<{ createPowerPlant: PowerPlant }, { input: CreatePowerPlantInput }>(
    CREATE_POWER_PLANT, {
      update(cache, { data }) {
        if (data?.createPowerPlant?.__typename === 'PowerPlant') {
          const existingPowerPlants = cache.readQuery<{ powerPlants: PowerPlantPage }>({ query: POWER_PLANTS });

          if (existingPowerPlants) {
            cache.writeQuery({
              query: POWER_PLANTS,
              data: {
                powerPlants: {
                  ...existingPowerPlants.powerPlants,
                  total: existingPowerPlants.powerPlants.total + 1,
                  list: [data.createPowerPlant, ...existingPowerPlants.powerPlants.list],
                },
              },
            });
          }
        }
      },
    }
  )
}
