import { PowerPlantPage } from '@core/graphql/types'
import useQuery from '../useQuery'
import { POWER_PLANTS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
  companyContractId?: string;
}

export const usePowerPlants = ({ skip = false, variables }: {
  skip?: boolean;
  variables?: Variables;
} = {} ) => {
  return useQuery<{ powerPlants: PowerPlantPage }>(POWER_PLANTS, {
    skip,
    variables: variables,
  })
}
