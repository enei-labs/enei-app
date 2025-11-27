/**
 * Task Progress 類型定義
 *
 * 對應後端的任務進度追蹤系統
 */

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export const TaskType = {
  INDUSTRY_BILL_EMAIL: 'industry-bill-email',
  DATA_IMPORT: 'data-import',
  REPORT_GENERATION: 'report-generation',
} as const;

export type TaskTypeValue = (typeof TaskType)[keyof typeof TaskType];

/**
 * 批次任務進度
 */
export interface BatchTaskProgress {
  batchId: string;
  type: TaskTypeValue | string;
  title: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  status: TaskStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 單一子任務進度
 */
export interface JobTaskProgress {
  jobId: string;
  label: string;
  status: TaskStatus;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
  startedAt?: string;
  completedAt?: string;
}

/**
 * 任務進度詳細資訊
 */
export interface TaskProgressDetail {
  batch: BatchTaskProgress;
  jobs: JobTaskProgress[];
}

/**
 * 任務進度 Context 狀態
 */
export interface TaskProgressState {
  /** 所有活躍的任務 */
  activeTasks: BatchTaskProgress[];
  /** 當前選中查看詳情的任務 */
  selectedBatchId: string | null;
  /** 選中任務的詳細進度 */
  selectedTaskDetail: TaskProgressDetail | null;
  /** 浮動面板是否開啟 */
  isPanelOpen: boolean;
  /** 是否正在載入 */
  isLoading: boolean;
}

/**
 * 任務進度 Context Actions
 */
export interface TaskProgressActions {
  /** 添加新任務（當 mutation 返回 batchId 時調用） */
  addTask: (task: BatchTaskProgress) => void;
  /** 選擇查看某個任務的詳情 */
  selectTask: (batchId: string | null) => void;
  /** 開啟/關閉浮動面板 */
  togglePanel: (open?: boolean) => void;
  /** 刷新活躍任務列表 */
  refreshActiveTasks: () => Promise<void>;
  /** 開始監聽某個任務的 SSE 進度 */
  startWatching: (batchId: string) => void;
  /** 停止監聽 */
  stopWatching: () => void;
}

export type TaskProgressContextValue = TaskProgressState & TaskProgressActions;

/**
 * SSE 事件資料
 */
export interface TaskProgressEvent {
  type: 'update' | 'complete' | 'error';
  data: TaskProgressDetail;
}
