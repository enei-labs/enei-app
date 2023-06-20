import { FieldConfig } from '@core/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FieldValues, useForm, UseFormProps } from 'react-hook-form'
import * as yup from 'yup'

interface Validations {
  [key: string]: any;
}

const useValidatedForm = <TFieldValues extends FieldValues = FieldValues, TContext = any>(
  fieldConfigs: FieldConfig[] = [],
  useFormProps?: UseFormProps<TFieldValues, TContext>,
): UseFormReturn<TFieldValues, TContext> => {

  // Create a validation schema using yup based on the field configurations passed
  const schema = useMemo(
    () =>
      yup.object({
        ...fieldConfigs.reduce((prev: Validations, curr: FieldConfig) => {
          // If the current field has validation, add it to the schema
          return curr && curr.validated
            ? { ...prev, [curr.name]: curr.validated }
            : prev
        }, {}),
      }),
    [fieldConfigs],
  )

  // If there is an issue in schema creation, you might want to handle it here.
  // For example, you could log it or show a user-friendly message.

  // Return the form hooks with the resolver for schema validation
  return useForm({ ...useFormProps, resolver: yupResolver(schema) })
}

export default useValidatedForm
