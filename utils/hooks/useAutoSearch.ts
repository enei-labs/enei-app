import { useEffect, useState } from "react";

/**
 * 自動搜尋 hook（支援 debounce）
 * 與 useSearch 的差異：
 * - useSearch: 需要使用者按 Enter 鍵才執行搜尋
 * - useAutoSearch: 自動 debounce 後執行搜尋
 *
 * @param delay - debounce 延遲時間（毫秒），預設 500ms
 */
export const useAutoSearch = (delay: number = 500) => {
  const [inputValue, setInputValue] = useState<string>(""); // 使用者當前輸入的值
  const [searchTerm, setSearchTerm] = useState<string>(""); // 送出搜尋的值（debounced）
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false); // 是否正在 debounce 等待中

  useEffect(() => {
    // 如果有輸入值且與 searchTerm 不同，表示正在 debounce
    if (inputValue !== searchTerm) {
      setIsDebouncing(true);
    }

    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, delay, searchTerm]);

  return {
    inputValue,
    setInputValue,
    searchTerm,
    isDebouncing, // 回傳是否正在 debounce 等待
  };
};
