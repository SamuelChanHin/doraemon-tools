import { PageType } from "@/components/pages/Home";
import { getDoraemonMovies, getDoraemonTools } from "@/lib/api";
import { Movies } from "@/server/database/entity/movie";
import { Tools } from "@/server/database/entity/tools";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

type Props = {
  page: PageType;
};

function useItemList({ page }: Props) {
  const [maxPage, setMaxPage] = useState(1);
  const [currentPage, setCurrentPage] = useState<PageType>(page);

  // Derived state: reset when page type changes (runs synchronously during render)
  if (currentPage !== page) {
    setCurrentPage(page);
    setMaxPage(1);
  }

  const pageNumbers = Array.from({ length: maxPage }, (_, i) => i + 1);

  const results = useQueries({
    queries: pageNumbers.map((pageNum) => ({
      queryKey: [`${page}-${pageNum}`],
      queryFn: async () => {
        const params = { page: pageNum, pageSize: 10 };
        const r =
          page === "TOOL"
            ? await getDoraemonTools(params)
            : await getDoraemonMovies(params);
        return (r.data || []) as (Tools | Movies)[];
      },
    })),
  });

  const list = useMemo(
    () => results.flatMap((r) => r.data || []),
    [results],
  );

  const isFetching = results.some((r) => r.isFetching);

  const hasError = results.find((r) => r.error);
  if (hasError?.error) {
    console.error(hasError.error);
  }

  const loadMore = () => {
    if (!isFetching) {
      setMaxPage((prev) => prev + 1);
    }
  };

  return {
    list,
    loadMore,
    loading: isFetching,
    error: hasError?.error ?? null,
  };
}

export default useItemList;
