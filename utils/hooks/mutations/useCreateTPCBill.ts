import { CreateTpcBillInput, TpcBill } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_TPC_BILL } from '@core/graphql/mutations';

export const useCreateTPCBill = () => {
  return useMutation<{ createTPCBill: TpcBill }, { input: CreateTpcBillInput }>(
    CREATE_TPC_BILL, {
      update(cache, { data }, { variables }) {
        if (data?.createTPCBill?.__typename === 'TPCBill') {
          // Cache the transferDocumentId from variables
          const transferDocumentId = variables?.input.transferDocumentId;
          
          // Use cache.modify to update the tpcBills list
          cache.modify({
            fields: {
              tpcBills: (existingData = { total: 0, list: [] }, { storeFieldName }) => {
                // Only update if this matches the document ID from the query variables
                if (transferDocumentId && !storeFieldName.includes(`transferDocumentId:${transferDocumentId}`)) {
                  return existingData;
                }
                
                // Get reference to the newly created bill
                const newBillRef = { __ref: cache.identify(data.createTPCBill) };
                
                return {
                  ...existingData,
                  total: existingData.total + 1,
                  list: [newBillRef, ...(existingData.list || [])]
                };
              }
            }
          });
        }
      },
    }
  )
}
