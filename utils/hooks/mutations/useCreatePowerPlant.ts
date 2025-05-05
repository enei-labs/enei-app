import { CreatePowerPlantInput, PowerPlant } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_POWER_PLANT } from '@core/graphql/mutations';

export const useCreatePowerPlant = (companyContractId: string) => {
  return useMutation<{ createPowerPlant: PowerPlant }, { input: CreatePowerPlantInput }>(
    CREATE_POWER_PLANT, {
      update(cache, { data }) {
        try {
          const newPowerPlant = data?.createPowerPlant;
          if (newPowerPlant?.__typename === 'PowerPlant') {
            // Update the powerPlants query using cache.modify
            cache.modify({
              fields: {
                powerPlants: (existingData = { total: 0, list: [] }, { readField }) => {
                  // Check if we're dealing with the right company contract
                  // const storeObj = cache.identify(newPowerPlant);
                  
                  // 直接獲取對象的緩存引用
                  const newPowerPlantRef = { __ref: cache.identify(newPowerPlant) };

                  // Only update if this is the right company's power plants list
                  return {
                    ...existingData,
                    total: existingData.total + 1,
                    list: [newPowerPlantRef, ...(existingData.list || [])]
                  };
                }
              }
            });
          }
        } catch (error) {
          console.error("Error updating cache for createPowerPlant", error);
        }
      },
    }
  )
}