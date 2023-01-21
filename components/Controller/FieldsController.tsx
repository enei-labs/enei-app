import {
  InputAutocomplete,
  InputAutocompleteList,
  InputText,
  InputTextarea,
} from '@components/Input'
import { FieldConfig } from '@core/types'
import { Form } from '@core/types/fieldController'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { get } from 'lodash'
import React from 'react'
import { Controller } from 'react-hook-form'

interface FieldsControllerProps {
  configs: FieldConfig[]
  form: Form
}

const FieldsController: React.FC<FieldsControllerProps> = ({ configs, form }) => {
  const { control, errors } = form

  return (
    <>
      {configs.map(item => {
        const { type, name, hint, component: Component, ...props } = item

        const helperText = get(errors, `${name}.message`)

        const controller =
          type === 'COMPONENT' && Component ? (
            <Component form={form} name={name} {...props} />
          ) : (
            <Controller
              name={name}
              control={control}
              render={({ field }) => {
                switch (type) {
                  case 'TEXT':
                  case 'PASSWORD':
                    return <InputText {...item} {...field} helperText={helperText} />

                  case 'TEXTAREA':
                    return <InputTextarea {...item} {...field} helperText={helperText} />

                  case 'SINGLE_SELECT':
                    return <InputAutocomplete {...item} {...field} helperText={helperText} />

                  case 'MULTIPLE_SELECT':
                    return <InputAutocompleteList {...item} {...field} helperText={helperText} />

                  default:
                    return <></>
                }
              }}
            />
          )

        return (
          <Box key={name} width={1}>
            {controller}
            <Typography variant="hint" color="text.secondary" mt={hint ? '5px' : ''}>
              {hint}
            </Typography>
          </Box>
        )
      })}
    </>
  )
}

export default FieldsController
