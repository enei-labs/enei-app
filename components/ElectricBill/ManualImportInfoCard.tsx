import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material';
import { Download, Person, AccessTime } from '@mui/icons-material';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

type BillSource = 'AUTO_GENERATED' | 'MANUAL_IMPORT' | null;

interface ManualImportInfoCardProps {
  billSource: BillSource;
  originalFileDownloadUrl?: string | null;
  importedBy?: string | null;
  importedAt?: Date | string | null;
}

export function ManualImportInfoCard({
  billSource,
  originalFileDownloadUrl,
  importedBy,
  importedAt,
}: ManualImportInfoCardProps) {
  // 只在手動匯入時顯示
  if (billSource !== 'MANUAL_IMPORT') {
    return null;
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'yyyy-MM-dd HH:mm:ss', { locale: zhTW });
  };

  return (
    <Card sx={{ mt: 2, backgroundColor: '#fff9e6' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Upload />
          手動匯入資訊
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  匯入者
                </Typography>
                <Typography variant="body2">
                  {importedBy || '-'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  匯入時間
                </Typography>
                <Typography variant="body2">
                  {formatDate(importedAt)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                原始檔案
              </Typography>
              {originalFileDownloadUrl ? (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => window.open(originalFileDownloadUrl, '_blank')}
                >
                  下載 Excel
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  無檔案
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// 修正 import
import { Upload } from '@mui/icons-material';
