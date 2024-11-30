import { useState } from "react";

export const useSearch = () => {
  const [inputValue, setInputValue] = useState<string>(""); // 用戶當前輸入的值
  const [searchTerm, setSearchTerm] = useState<string>(""); // 送出搜尋的值

  const executeSearch = () => {
    setSearchTerm(inputValue);
  };

  return {
    inputValue,
    setInputValue,
    searchTerm,
    executeSearch,
  };
};