import { FieldConfig } from '@core/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm, UseFormProps, FieldValues } from 'react-hook-form'
import * as yup from 'yup'

interface Validations {
  [key: string]: yup.AnySchema;
}

const useValidatedForm = <TFieldValues extends FieldValues = FieldValues, TContext = any>(
  fieldConfigs: FieldConfig[] = [],
  useFormProps?: UseFormProps<TFieldValues, TContext>,
) => {
  const schema = useMemo(() => {
    const schemaFields = fieldConfigs.reduce<Validations>((acc, fieldConfig) => {
      if (fieldConfig.validated) {
        acc[fieldConfig.name] = fieldConfig.validated;
      }
      return acc;
    }, {});

    return yup.object().shape(schemaFields);
  }, [fieldConfigs]);

  return useForm<TFieldValues, TContext>({
    ...useFormProps,
    resolver: yupResolver(schema) as any,
  });
};

export default useValidatedForm;