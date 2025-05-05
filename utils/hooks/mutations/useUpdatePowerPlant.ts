import { PowerPlant, PowerPlantPage, UpdatePowerPlantInput } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_POWER_PLANT } from '@core/graphql/mutations'
import { POWER_PLANTS } from '@core/graphql/queries'

interface PowerPlantUpdateQuery {
  powerPlants: PowerPlantPage;
}

export const useUpdatePowerPlant = (companyContractId: string) => {
  return useMutation<{ updatePowerPlant: PowerPlant }, { input: UpdatePowerPlantInput }>(
    UPDATE_POWER_PLANT, {
      refetchQueries: [POWER_PLANTS],
    }
  )
}
