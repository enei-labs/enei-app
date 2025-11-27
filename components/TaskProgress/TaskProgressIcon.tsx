import React from 'react';
import { Badge, IconButton, Tooltip, CircularProgress } from '@mui/material';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTaskProgress, TaskStatus } from '@core/context/task-progress';

/**
 * 任務進度 Navbar Icon
 *
 * 顯示在頂部導航欄，點擊後開啟任務進度浮動面板
 */
const TaskProgressIcon: React.FC = () => {
  const { activeTasks, togglePanel, isPanelOpen } = useTaskProgress();

  // 計算各狀態的數量
  const inProgressCount = activeTasks.filter(
    (t) => t.status === TaskStatus.IN_PROGRESS
  ).length;
  const pendingCount = activeTasks.filter(
    (t) => t.status === TaskStatus.PENDING
  ).length;
  const failedCount = activeTasks.filter(
    (t) => t.status === TaskStatus.FAILED
  ).length;

  const activeCount = inProgressCount + pendingCount;
  const hasActiveTasks = activeCount > 0;
  const hasFailedTasks = failedCount > 0;

  // 決定圖標和顏色
  const getIconAndColor = () => {
    if (inProgressCount > 0) {
      return {
        icon: (
          <CircularProgress
            size={20}
            thickness={5}
            sx={{ color: 'inherit' }}
          />
        ),
        color: 'primary' as const,
        tooltip: `${inProgressCount} 個任務進行中`,
      };
    }
    if (hasFailedTasks) {
      return {
        icon: <ErrorOutlineIcon />,
        color: 'error' as const,
        tooltip: `${failedCount} 個任務失敗`,
      };
    }
    return {
      icon: <PlaylistPlayIcon />,
      color: 'inherit' as const,
      tooltip: '背景任務',
    };
  };

  const { icon, color, tooltip } = getIconAndColor();

  // 如果沒有任務，不顯示
  if (activeTasks.length === 0) {
    return null;
  }

  return (
    <Tooltip title={tooltip}>
      <IconButton
        size="large"
        color={color}
        onClick={() => togglePanel()}
        sx={{
          mr: 1,
          ...(isPanelOpen && {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }),
        }}
      >
        <Badge
          badgeContent={hasActiveTasks ? activeCount : undefined}
          color={hasFailedTasks ? 'error' : 'primary'}
          max={99}
        >
          {icon}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default TaskProgressIcon;
