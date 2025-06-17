import { ApolloClient, InMemoryCache } from '@apollo/client'
import possibleTypesResult from './possibleTypes'
import { offsetLimitPagination } from '@apollo/client/utilities'
import type { FieldPolicy, FieldMergeFunction } from '@apollo/client'

const url = process.env.NEXT_PUBLIC_API_BASE_URL || ''

const buildPageFieldPolicy = (keyArgs: string[] = []): FieldPolicy => {
  const { merge: rawMerge } = offsetLimitPagination()

  return {
    keyArgs,
    merge(existing, incoming, options) {
      const mergeFn: FieldMergeFunction<any[], any[]> =
        typeof rawMerge === 'function'
          ? rawMerge
          : (_, inc) => inc // fallback if merge === false

      const list = mergeFn(existing?.list ?? [], incoming.list, options)
      return { total: incoming.total, list }
    },
  }
}

const client = new ApolloClient({
  uri: `${url}/graphql`,
  cache: new InMemoryCache({
    possibleTypes: possibleTypesResult.possibleTypes,
    typePolicies: {
      Query: {
        fields: {
          accounts:          buildPageFieldPolicy(['term']),
          companies:         buildPageFieldPolicy(['term']),
          admins:            buildPageFieldPolicy(['role']),
          guests:            buildPageFieldPolicy(['roles']),
          companyContracts:  buildPageFieldPolicy(['companyId', 'term']),
          users:             buildPageFieldPolicy(['roles', 'term', 'onlyBasicInformation']),
          powerPlants:       buildPageFieldPolicy(['companyContractId', 'term']),
          userContracts:     buildPageFieldPolicy(['userId', 'term']),
          transferDocuments: buildPageFieldPolicy(['term']),
          tpcBills:          buildPageFieldPolicy(['transferDocumentId']),
          userBillConfigs:   buildPageFieldPolicy(['term']),
          industryBillConfigs: buildPageFieldPolicy(['term']),
          industryBills: buildPageFieldPolicy([
            'term',
            'lastYearOnly',
            'month',
            'industryBillConfigId',
          ]),
          userBills: buildPageFieldPolicy([
            'term',
            'lastYearOnly',
            'month',
            'userBillConfigId',
          ]),
        },
      },
    },
  }),
  credentials: 'include',
})

export default client
