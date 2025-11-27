import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Collapse,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SyncIcon from '@mui/icons-material/Sync';
import {
  useTaskProgress,
  TaskStatus,
  BatchTaskProgress,
  JobTaskProgress,
} from '@core/context/task-progress';

/**
 * 任務進度浮動面板
 *
 * 顯示在畫面右下角，列出所有進行中的背景任務
 */
const TaskProgressPanel: React.FC = () => {
  const {
    activeTasks,
    selectedBatchId,
    selectedTaskDetail,
    isPanelOpen,
    togglePanel,
    selectTask,
  } = useTaskProgress();

  if (!isPanelOpen) {
    return null;
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 400,
        maxHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1300,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          背景任務
        </Typography>
        <IconButton
          size="small"
          onClick={() => togglePanel(false)}
          sx={{ color: 'white' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Task List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {activeTasks.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">目前沒有進行中的任務</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {activeTasks.map((task, index) => (
              <React.Fragment key={task.batchId}>
                {index > 0 && <Divider />}
                <TaskItem
                  task={task}
                  isSelected={selectedBatchId === task.batchId}
                  onSelect={() =>
                    selectTask(
                      selectedBatchId === task.batchId ? null : task.batchId
                    )
                  }
                  detail={
                    selectedBatchId === task.batchId
                      ? selectedTaskDetail
                      : undefined
                  }
                />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

// ===== Sub Components =====

interface TaskItemProps {
  task: BatchTaskProgress;
  isSelected: boolean;
  onSelect: () => void;
  detail?: { jobs: JobTaskProgress[] } | null;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isSelected,
  onSelect,
  detail,
}) => {
  const progress =
    task.totalJobs > 0
      ? ((task.completedJobs + task.failedJobs) / task.totalJobs) * 100
      : 0;

  const statusIcon = getStatusIcon(task.status);
  const statusColor = getStatusColor(task.status);

  return (
    <>
      <ListItemButton onClick={onSelect} selected={isSelected}>
        <ListItemIcon sx={{ minWidth: 36 }}>{statusIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="body2" fontWeight="medium" noWrap>
                {task.title}
              </Typography>
              <Chip
                size="small"
                label={getStatusText(task.status)}
                color={statusColor}
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
          }
          secondary={
            <Box sx={{ mt: 0.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {task.completedJobs}/{task.totalJobs} 完成
                  {task.failedJobs > 0 && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="error"
                    >
                      {' '}
                      ({task.failedJobs} 失敗)
                    </Typography>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={task.failedJobs > 0 ? 'error' : 'primary'}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          }
        />
        {isSelected ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      {/* Job Details */}
      <Collapse in={isSelected} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 4, pr: 2, pb: 1, maxHeight: 200, overflow: 'auto' }}>
          {detail?.jobs && detail.jobs.length > 0 ? (
            <List dense disablePadding>
              {detail.jobs.map((job) => (
                <JobItem key={job.jobId} job={job} />
              ))}
            </List>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ py: 1 }}>
              載入中...
            </Typography>
          )}
        </Box>
      </Collapse>
    </>
  );
};

interface JobItemProps {
  job: JobTaskProgress;
}

const JobItem: React.FC<JobItemProps> = ({ job }) => {
  const statusIcon = getStatusIcon(job.status, true);

  return (
    <ListItem
      disablePadding
      sx={{
        py: 0.5,
        opacity: job.status === TaskStatus.COMPLETED ? 0.6 : 1,
      }}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>{statusIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" noWrap>
            {job.label}
          </Typography>
        }
        secondary={
          job.errorMessage ? (
            <Tooltip title={job.errorMessage}>
              <Typography
                variant="caption"
                color="error"
                noWrap
                sx={{ maxWidth: 250, display: 'block' }}
              >
                {job.errorMessage}
              </Typography>
            </Tooltip>
          ) : undefined
        }
      />
    </ListItem>
  );
};

// ===== Helper Functions =====

function getStatusIcon(status: TaskStatus, small = false) {
  const fontSize = small ? 'small' : 'medium';

  switch (status) {
    case TaskStatus.COMPLETED:
      return <CheckCircleIcon color="success" fontSize={fontSize} />;
    case TaskStatus.FAILED:
      return <ErrorIcon color="error" fontSize={fontSize} />;
    case TaskStatus.IN_PROGRESS:
      return (
        <SyncIcon
          color="primary"
          fontSize={fontSize}
          sx={{ animation: 'spin 2s linear infinite' }}
        />
      );
    case TaskStatus.PENDING:
    default:
      return <HourglassEmptyIcon color="disabled" fontSize={fontSize} />;
  }
}

function getStatusColor(
  status: TaskStatus
): 'default' | 'primary' | 'success' | 'error' {
  switch (status) {
    case TaskStatus.COMPLETED:
      return 'success';
    case TaskStatus.FAILED:
      return 'error';
    case TaskStatus.IN_PROGRESS:
      return 'primary';
    case TaskStatus.PENDING:
    default:
      return 'default';
  }
}

function getStatusText(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.COMPLETED:
      return '完成';
    case TaskStatus.FAILED:
      return '失敗';
    case TaskStatus.IN_PROGRESS:
      return '進行中';
    case TaskStatus.PENDING:
    default:
      return '等待中';
  }
}

// Add keyframes for spin animation
const globalStyles = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('task-progress-styles');
  if (!styleElement) {
    const style = document.createElement('style');
    style.id = 'task-progress-styles';
    style.textContent = globalStyles;
    document.head.appendChild(style);
  }
}

export default TaskProgressPanel;
