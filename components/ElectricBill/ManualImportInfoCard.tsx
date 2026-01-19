import { Card, CardContent, Typography, Box, Button, Grid, Collapse, Divider, CircularProgress } from '@mui/material';
import { Download, Person, AccessTime, Upload, ExpandMore, ExpandLess, PictureAsPdf, Refresh, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useState } from 'react';

type BillSource = 'AUTO_GENERATED' | 'MANUAL_IMPORT' | null;

interface ManualImportInfoCardProps {
  billSource: BillSource | null;
  originalFileDownloadUrl?: string | null;
  generatedPdfDownloadUrl?: string | null;
  importedBy?: string | null;
  importedAt?: Date | string | null;
  /** 是否預設展開 PDF 預覽 */
  defaultExpandPdf?: boolean;
  /** 替換手動匯入的回調 */
  onReplace?: () => void;
  /** 刪除手動匯入的回調 */
  onDelete?: () => void;
  /** 刪除中狀態 */
  isDeleting?: boolean;
}

export function ManualImportInfoCard({
  billSource,
  originalFileDownloadUrl,
  generatedPdfDownloadUrl,
  importedBy,
  importedAt,
  defaultExpandPdf = true,
  onReplace,
  onDelete,
  isDeleting = false,
}: ManualImportInfoCardProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(defaultExpandPdf);

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

        {/* PDF 預覽區塊 */}
        {generatedPdfDownloadUrl && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PictureAsPdf />}
              endIcon={showPdfPreview ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowPdfPreview(!showPdfPreview)}
              sx={{ mb: 1 }}
            >
              {showPdfPreview ? '收合' : '展開'} 手動匯入電費單 PDF
            </Button>
            <Button
              size="small"
              startIcon={<Download />}
              onClick={() => window.open(generatedPdfDownloadUrl, '_blank')}
              sx={{ ml: 1, mb: 1 }}
            >
              下載 PDF
            </Button>

            <Collapse in={showPdfPreview}>
              <Box
                sx={{
                  mt: 1,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                }}
              >
                <iframe
                  src={generatedPdfDownloadUrl}
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                  title="手動匯入電費單 PDF 預覽"
                />
              </Box>
            </Collapse>
          </Box>
        )}

        {!generatedPdfDownloadUrl && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              尚無生成的 PDF 檔案
            </Typography>
          </Box>
        )}

        {/* 操作按鈕區塊 */}
        {(onReplace || onDelete) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {onReplace && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Refresh />}
                  onClick={onReplace}
                  disabled={isDeleting}
                >
                  替換檔案
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={isDeleting ? <CircularProgress size={20} /> : <Delete />}
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? '刪除中...' : '刪除手動匯入'}
                </Button>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
