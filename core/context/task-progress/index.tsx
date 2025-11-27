import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import {
  TaskProgressContextValue,
  TaskProgressState,
  BatchTaskProgress,
  TaskProgressDetail,
  TaskStatus,
} from './types';

// ===== GraphQL Queries =====

export const TASK_PROGRESS_QUERY = gql`
  query TaskProgress($batchId: ID!) {
    taskProgress(batchId: $batchId) {
      batch {
        batchId
        type
        title
        totalJobs
        completedJobs
        failedJobs
        status
        createdAt
        updatedAt
      }
      jobs {
        jobId
        label
        status
        errorMessage
        startedAt
        completedAt
      }
    }
  }
`;

// ===== Context =====

const initialState: TaskProgressState = {
  activeTasks: [],
  selectedBatchId: null,
  selectedTaskDetail: null,
  isPanelOpen: false,
  isLoading: false,
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTIVE_TASKS'; payload: BatchTaskProgress[] }
  | { type: 'ADD_TASK'; payload: BatchTaskProgress }
  | { type: 'UPDATE_TASK'; payload: BatchTaskProgress }
  | { type: 'REMOVE_TASK'; payload: string }
  | { type: 'SELECT_TASK'; payload: string | null }
  | { type: 'SET_TASK_DETAIL'; payload: TaskProgressDetail | null }
  | { type: 'TOGGLE_PANEL'; payload?: boolean };

function reducer(state: TaskProgressState, action: Action): TaskProgressState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ACTIVE_TASKS':
      return { ...state, activeTasks: action.payload };

    case 'ADD_TASK': {
      const exists = state.activeTasks.some(
        (t) => t.batchId === action.payload.batchId
      );
      if (exists) {
        return {
          ...state,
          activeTasks: state.activeTasks.map((t) =>
            t.batchId === action.payload.batchId ? action.payload : t
          ),
        };
      }
      return {
        ...state,
        activeTasks: [action.payload, ...state.activeTasks],
        isPanelOpen: true, // 自動開啟面板
      };
    }

    case 'UPDATE_TASK':
      return {
        ...state,
        activeTasks: state.activeTasks.map((t) =>
          t.batchId === action.payload.batchId ? action.payload : t
        ),
      };

    case 'REMOVE_TASK':
      return {
        ...state,
        activeTasks: state.activeTasks.filter(
          (t) => t.batchId !== action.payload
        ),
        selectedBatchId:
          state.selectedBatchId === action.payload
            ? null
            : state.selectedBatchId,
      };

    case 'SELECT_TASK':
      return {
        ...state,
        selectedBatchId: action.payload,
        selectedTaskDetail: action.payload ? state.selectedTaskDetail : null,
      };

    case 'SET_TASK_DETAIL':
      return {
        ...state,
        selectedTaskDetail: action.payload,
        // 同時更新 activeTasks 中的對應任務
        activeTasks: action.payload
          ? state.activeTasks.map((t) =>
              t.batchId === action.payload?.batch.batchId
                ? action.payload.batch
                : t
            )
          : state.activeTasks,
      };

    case 'TOGGLE_PANEL':
      return {
        ...state,
        isPanelOpen: action.payload ?? !state.isPanelOpen,
      };

    default:
      return state;
  }
}

const TaskProgressContext = createContext<TaskProgressContextValue | null>(
  null
);

export const useTaskProgress = (): TaskProgressContextValue => {
  const context = useContext(TaskProgressContext);
  if (!context) {
    throw new Error(
      'useTaskProgress must be used within a TaskProgressProvider'
    );
  }
  return context;
};

// ===== Provider =====

interface TaskProgressProviderProps {
  children: React.ReactNode;
}

export const TaskProgressProvider: React.FC<TaskProgressProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [fetchTaskDetail] = useLazyQuery<{
    taskProgress: TaskProgressDetail | null;
  }>(TASK_PROGRESS_QUERY, {
    fetchPolicy: 'network-only',
  });

  // 清理 SSE 連接
  const cleanupSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // 組件卸載時清理
  useEffect(() => {
    return () => cleanupSSE();
  }, [cleanupSSE]);

  // ===== Actions =====

  const addTask = useCallback((task: BatchTaskProgress) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);

  const selectTask = useCallback(
    async (batchId: string | null) => {
      dispatch({ type: 'SELECT_TASK', payload: batchId });

      if (batchId) {
        // 立即獲取詳情
        const { data } = await fetchTaskDetail({ variables: { batchId } });
        if (data?.taskProgress) {
          dispatch({ type: 'SET_TASK_DETAIL', payload: data.taskProgress });
        }
      }
    },
    [fetchTaskDetail]
  );

  const togglePanel = useCallback((open?: boolean) => {
    dispatch({ type: 'TOGGLE_PANEL', payload: open });
  }, []);

  const refreshActiveTasks = useCallback(async () => {
    // 目前簡化實作：重新查詢已知的任務
    // 未來可以加入 GraphQL 訂閱或 SSE 來自動更新
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // 更新每個活躍任務的狀態
      const updatedTasks = await Promise.all(
        state.activeTasks.map(async (task) => {
          const { data } = await fetchTaskDetail({
            variables: { batchId: task.batchId },
          });
          return data?.taskProgress?.batch ?? task;
        })
      );
      dispatch({ type: 'SET_ACTIVE_TASKS', payload: updatedTasks });
    } catch (error) {
      console.error('Failed to refresh active tasks:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.activeTasks, fetchTaskDetail]);

  const startWatching = useCallback(
    (batchId: string) => {
      cleanupSSE();

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const sseUrl = `${apiBaseUrl}/api/task-progress/stream/${batchId}`;

      // 嘗試使用 SSE
      try {
        const eventSource = new EventSource(sseUrl, { withCredentials: true });
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as TaskProgressDetail;
            dispatch({ type: 'SET_TASK_DETAIL', payload: data });

            // 如果任務已完成或失敗，關閉 SSE
            if (
              data.batch.status === TaskStatus.COMPLETED ||
              data.batch.status === TaskStatus.FAILED
            ) {
              cleanupSSE();
            }
          } catch (error) {
            console.error('Failed to parse SSE data:', error);
          }
        };

        eventSource.onerror = () => {
          // SSE 失敗，切換到輪詢模式
          cleanupSSE();
          startPolling(batchId);
        };
      } catch {
        // SSE 不可用，使用輪詢
        startPolling(batchId);
      }
    },
    [cleanupSSE]
  );

  const startPolling = useCallback(
    (batchId: string) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      const poll = async () => {
        const { data } = await fetchTaskDetail({ variables: { batchId } });
        if (data?.taskProgress) {
          dispatch({ type: 'SET_TASK_DETAIL', payload: data.taskProgress });

          // 如果任務已完成或失敗，停止輪詢
          if (
            data.taskProgress.batch.status === TaskStatus.COMPLETED ||
            data.taskProgress.batch.status === TaskStatus.FAILED
          ) {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        }
      };

      // 立即執行一次
      poll();

      // 每 2 秒輪詢一次
      pollingIntervalRef.current = setInterval(poll, 2000);
    },
    [fetchTaskDetail]
  );

  const stopWatching = useCallback(() => {
    cleanupSSE();
  }, [cleanupSSE]);

  // 當選中的任務改變時，開始監聽
  useEffect(() => {
    if (state.selectedBatchId) {
      const task = state.activeTasks.find(
        (t) => t.batchId === state.selectedBatchId
      );
      // 只有在任務進行中時才開始監聽
      if (
        task &&
        (task.status === TaskStatus.PENDING ||
          task.status === TaskStatus.IN_PROGRESS)
      ) {
        startWatching(state.selectedBatchId);
      }
    }

    return () => {
      // 切換任務時停止監聽
      stopWatching();
    };
  }, [state.selectedBatchId]); // 故意省略 startWatching 和 stopWatching 以避免無限循環

  const value: TaskProgressContextValue = {
    ...state,
    addTask,
    selectTask,
    togglePanel,
    refreshActiveTasks,
    startWatching,
    stopWatching,
  };

  return (
    <TaskProgressContext.Provider value={value}>
      {children}
    </TaskProgressContext.Provider>
  );
};

export * from './types';
