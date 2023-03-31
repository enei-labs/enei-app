import { CreatePowerPlantInput, PowerPlant, PowerPlantPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_POWER_PLANT } from '@core/graphql/mutations';
import { POWER_PLANT_FIELDS } from '@core/graphql/fragment';

export const useCreatePowerPlant = () => {
  return useMutation<{ createPowerPlant: PowerPlant }, { input: CreatePowerPlantInput }>(
    CREATE_POWER_PLANT, {
      update(cache, { data }) {
        if (data && data.createPowerPlant.__typename === 'PowerPlant') {
          cache.modify({
            fields: {
              powerPlants(powerPlantPage: PowerPlantPage) {
                const newPowerPlant = cache.writeFragment({
                  data: data.createPowerPlant,
                  fragment: POWER_PLANT_FIELDS
                });

                return {
                  total: powerPlantPage.total + 1,
                  list: [newPowerPlant, ...powerPlantPage.list],
                };
              }
            },
            broadcast: false,
          });
        }
      }
    }
  )
}
