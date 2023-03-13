import { PowerPlant, PowerPlantPage, UpdatePowerPlantInput } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_POWER_PLANT } from '@core/graphql/mutations'
import { POWER_PLANTS } from '@core/graphql/queries'

interface PowerPlantUpdateQuery {
  powerPlants: PowerPlantPage;
}

export const useUpdatePowerPlant = () => {
  return useMutation<{ updatePowerPlant: PowerPlant }, { input: UpdatePowerPlantInput }>(
    UPDATE_POWER_PLANT, {
      update(cache, { data }) {
        if (data && data.updatePowerPlant.__typename === 'PowerPlant') {
          cache.updateQuery({ query: POWER_PLANTS }, (originData: PowerPlantUpdateQuery | null) => {
            if (!originData) return;
            const index = originData.powerPlants.list.findIndex(p => p.id === data.updatePowerPlant.id)

            return ({
              powerPlants: {
                total: originData.powerPlants.total,
                list: [
                  ...originData.powerPlants.list.slice(0, index),
                  data.updatePowerPlant,
                  ...originData.powerPlants.list.slice(index + 1),
                ],
              }
          })});

        }
      }
    }
  )
}
