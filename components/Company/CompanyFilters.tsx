import { Autocomplete, TextField, Box, Button, Chip } from '@mui/material';
import { CompanyType } from '@core/graphql/types';
import { companyTypeRadios } from '@core/look-up/company-type';
import ClearIcon from '@mui/icons-material/Clear';

interface CompanyFiltersProps {
  types: CompanyType[];
  onTypesChange: (types: CompanyType[]) => void;
  onClear: () => void;
}

export function CompanyFilters({
  types,
  onTypesChange,
  onClear,
}: CompanyFiltersProps) {
  const hasFilters = types.length > 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      {/* 戶別篩選 */}
      <Autocomplete
        multiple
        size="small"
        options={companyTypeRadios}
        getOptionLabel={(option) => option.label}
        value={companyTypeRadios.filter((opt) => types.includes(opt.value))}
        onChange={(_, newValue) => {
          onTypesChange(newValue.map((v) => v.value));
        }}
        renderInput={(params) => (
          <TextField {...params} label="戶別" placeholder={types.length === 0 ? '全部' : ''} />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              size="small"
            />
          ))
        }
        sx={{ minWidth: 200 }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
      />

      {/* 清除篩選按鈕 */}
      {hasFilters && (
        <Button
          size="small"
          startIcon={<ClearIcon />}
          onClick={onClear}
          color="inherit"
        >
          清除篩選
        </Button>
      )}
    </Box>
  );
}
