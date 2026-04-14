import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const readParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

export const useSearch = ({
  paramName = "search",
}: { paramName?: string } = {}) => {
  const router = useRouter();
  const initialFromUrl = readParam(router.query[paramName]);

  const [inputValue, setInputValue] = useState<string>(initialFromUrl);
  const [searchTerm, setSearchTerm] = useState<string>(initialFromUrl);
  const [initialSearchTerm, setInitialSearchTerm] =
    useState<string>(initialFromUrl);

  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!router.isReady || hydratedRef.current) return;
    hydratedRef.current = true;
    const value = readParam(router.query[paramName]);
    if (value) {
      setInputValue(value);
      setSearchTerm(value);
      setInitialSearchTerm(value);
    }
  }, [router.isReady, router.query, paramName]);

  const executeSearch = () => {
    setSearchTerm(inputValue);

    const nextQuery = { ...router.query };
    if (inputValue) {
      nextQuery[paramName] = inputValue;
    } else {
      delete nextQuery[paramName];
    }

    router.replace(
      { pathname: router.pathname, query: nextQuery },
      undefined,
      { shallow: true }
    );
  };

  return {
    inputValue,
    setInputValue,
    searchTerm,
    executeSearch,
    initialSearchTerm,
  };
};
