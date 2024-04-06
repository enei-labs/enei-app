import { CreatePowerPlantInput, PowerPlant, PowerPlantPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_POWER_PLANT } from '@core/graphql/mutations';
import { POWER_PLANTS } from '@core/graphql/queries';

export const useCreatePowerPlant = (companyContractId: string) => {
  return useMutation<{ createPowerPlant: PowerPlant }, { input: CreatePowerPlantInput }>(
    CREATE_POWER_PLANT, {
      update(cache, { data }) {
        try {
          if (data?.createPowerPlant?.__typename === 'PowerPlant') {
            const existingPowerPlantsData = cache.readQuery<{ powerPlants: PowerPlantPage }>({
              query: POWER_PLANTS,
              variables: {
                limit: 10,
                offset: 0,
                companyContractId: companyContractId,
              },
            });

            if (existingPowerPlantsData) {
              const updatedPowerPlants = {
                ...existingPowerPlantsData,
                total: (existingPowerPlantsData?.powerPlants?.total ?? 0) + 1,
                list: [data.createPowerPlant, ...(existingPowerPlantsData?.powerPlants?.list ?? [])],
              };

              cache.writeQuery({
                query: POWER_PLANTS,
                variables: {
                  limit: 10,
                  offset: 0,
                  companyContractId: companyContractId,
                },
                data: { powerPlants: updatedPowerPlants },
              });
            }
          }
        } catch (error) {
          console.error("Error updating cache for createPowerPlant", error);
        }
      },
    }
  )
}