import { useRouter } from "next/router";
import { useCallback } from "react";

/**
 * 用 URL query 驅動 dialog 開關：一個字串 id 參數代表「哪筆資料的 dialog 被打開」
 * - `id`：URL 當下的值（沒開則為 undefined），呼叫端可用它觸發 GraphQL 單筆查詢並自動打開 dialog
 * - `open(id)`：把 id 寫入 URL
 * - `close()`：把 id 從 URL 移除
 */
export const useUrlDialogSync = (paramName: string) => {
  const router = useRouter();
  const raw = router.query[paramName];
  const id = typeof raw === "string" ? raw : undefined;

  const open = useCallback(
    (value: string) => {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, [paramName]: value },
        },
        undefined,
        { shallow: true }
      );
    },
    [router, paramName]
  );

  const close = useCallback(() => {
    const { [paramName]: _ignored, ...rest } = router.query;
    router.push(
      { pathname: router.pathname, query: rest },
      undefined,
      { shallow: true }
    );
  }, [router, paramName]);

  return { id, open, close };
};
