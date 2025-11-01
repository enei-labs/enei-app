import { Chip } from '@mui/material';

type ElectricBillStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'MANUAL' | 'REJECTED';
type BillSource = 'AUTO_GENERATED' | 'MANUAL_IMPORT' | null;

interface BillStatusBadgeProps {
  status: ElectricBillStatus;
  billSource?: BillSource;
}

const STATUS_CONFIG = {
  MANUAL: {
    label: '手動匯入',
    color: 'secondary' as const,
  },
  DRAFT: {
    label: '草稿',
    color: 'default' as const,
  },
  PENDING: {
    label: '待審核',
    color: 'warning' as const,
  },
  APPROVED: {
    label: '已審核',
    color: 'success' as const,
  },
  REJECTED: {
    label: '已拒絕',
    color: 'error' as const,
  },
};

export function BillStatusBadge({ status, billSource }: BillStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  // 如果是已審核且來源是手動匯入，顯示特殊標籤
  if (status === 'APPROVED' && billSource === 'MANUAL_IMPORT') {
    return (
      <Chip
        label="已審核 (手動)"
        color="success"
        size="small"
        variant="outlined"
      />
    );
  }

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
    />
  );
}
