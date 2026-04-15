import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

const readParam = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

/**
 * URL 同步的字串陣列 query param（如 `?statuses=A,B,C`）
 * - `validValues` 用於過濾掉不在 enum 內的字串，避免被惡意 URL 污染
 * - 空陣列會把 query key 從網址移除
 */
export const useUrlArrayParam = <T extends string>(
  paramName: string,
  validValues: readonly T[]
): [T[], (next: T[]) => void] => {
  const router = useRouter();

  const values = useMemo<T[]>(() => {
    const raw = readParam(router.query[paramName]);
    if (!raw) return [];
    const allowed = new Set<string>(validValues);
    return raw.split(",").filter((v): v is T => allowed.has(v));
  }, [router.query, paramName, validValues]);

  const setValues = useCallback(
    (next: T[]) => {
      const { [paramName]: _ignored, ...rest } = router.query;
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...rest,
            ...(next.length > 0 ? { [paramName]: next.join(",") } : {}),
          },
        },
        undefined,
        { shallow: true }
      );
    },
    [router, paramName]
  );

  return [values, setValues];
};

/**
 * 一次清掉多個 query param（單一 router.push，只會產生一筆 history entry）
 */
export const useClearUrlParams = () => {
  const router = useRouter();
  return useCallback(
    (paramNames: string[]) => {
      const next = { ...router.query };
      for (const name of paramNames) delete next[name];
      router.push(
        { pathname: router.pathname, query: next },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );
};
