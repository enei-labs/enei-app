import { memo } from "react";
import {
  InputAutocomplete,
  InputAutocompleteList,
  InputDate,
  InputText,
  InputTextarea,
} from "@components/Input";
import { FieldConfig } from "@core/types";
import { Form } from "@core/types/fieldController";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Controller } from "react-hook-form";
import UploadDocBox from "../UploadDocBox";

type FieldType =
  | "NUMBER"
  | "EMAIL"
  | "TEXT"
  | "PASSWORD"
  | "TEXTAREA"
  | "DATE"
  | "DATE_TEXTFILE"
  | "SINGLE_SELECT"
  | "MULTIPLE_SELECT"
  | "FILE"
  | "COMPONENT";
interface FieldsControllerProps {
  configs: FieldConfig[];
  form: Form;
}

const FieldsController: React.FC<FieldsControllerProps> = ({
  configs,
  form,
}) => {
  const { control, errors } = form;

  const renderInputField = (fieldProps: any, type: FieldType, item: any) => {
    const { name } = fieldProps.field;
    const helperText = errors[name]?.message;

    switch (type) {
      case "NUMBER":
      case "EMAIL":
      case "TEXT":
      case "PASSWORD":
        return (
          <InputText {...item} {...fieldProps.field} helperText={helperText} />
        );

      case "TEXTAREA":
        return (
          <InputTextarea
            {...item}
            {...fieldProps.field}
            helperText={helperText}
          />
        );

      case "DATE":
      case "DATE_TEXTFILE":
        return (
          <InputDate {...item} {...fieldProps.field} helperText={helperText} />
        );

      case "SINGLE_SELECT":
        return (
          <InputAutocomplete
            {...item}
            {...fieldProps.field}
            helperText={helperText}
          />
        );

      case "MULTIPLE_SELECT":
        return (
          <InputAutocompleteList
            {...item}
            {...fieldProps.field}
            helperText={helperText}
          />
        );

      case "FILE":
        return (
          <UploadDocBox label={item.label} {...item} {...fieldProps.field} />
        );

      default:
        return <></>;
    }
  };

  return (
    <>
      {configs.map((item) => {
        const { type, name, hint, component: Component, ...props } = item;

        const controller =
          type === "COMPONENT" && Component ? (
            <Component form={form} name={name} {...props} />
          ) : (
            <Controller
              name={name}
              control={control}
              render={(fieldProps) =>
                renderInputField(fieldProps, type as FieldType, item)
              }
            />
          );

        return (
          <Box key={name} width={1}>
            {controller}
            {hint && (
              <Typography variant="caption" color="text.secondary" mt="5px">
                {hint}
              </Typography>
            )}
          </Box>
        );
      })}
    </>
  );
};

export default memo(FieldsController);
