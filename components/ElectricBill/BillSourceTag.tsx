import { Chip } from '@mui/material';
import { Upload, AutoAwesome } from '@mui/icons-material';

type BillSource = 'AUTO_GENERATED' | 'MANUAL_IMPORT' | null;

interface BillSourceTagProps {
  billSource: BillSource;
}

export function BillSourceTag({ billSource }: BillSourceTagProps) {
  if (billSource === 'MANUAL_IMPORT') {
    return (
      <Chip
        icon={<Upload fontSize="small" />}
        label="手動匯入"
        color="warning"
        size="small"
        variant="outlined"
      />
    );
  }

  if (billSource === 'AUTO_GENERATED') {
    return (
      <Chip
        icon={<AutoAwesome fontSize="small" />}
        label="自動生成"
        color="info"
        size="small"
        variant="outlined"
      />
    );
  }

  // 舊資料可能沒有 billSource，顯示為自動生成
  return (
    <Chip
      icon={<AutoAwesome fontSize="small" />}
      label="自動生成"
      color="info"
      size="small"
      variant="outlined"
    />
  );
}
