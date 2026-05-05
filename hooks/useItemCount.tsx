import { PageType } from "@/components/pages/Home";
import { getDoraemonMovieCount, getDoraemonToolCount } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Props = {
  page: PageType;
};

function useItemCount({ page }: Props) {
  const [count, setCount] = useState<number>(0);

  const reset = () => {
    setCount(0);
  };

  const query = useQuery({
    queryKey: ["item-count", page],
    queryFn: async () => {
      if (page === "TOOL") {
        const response = await getDoraemonToolCount();
        return response.data || 0;
      }

      const response = await getDoraemonMovieCount();
      return response.data || 0;
    },
    retry: false,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      setCount(query.data);
    }
  }, [query.data]);

  useEffect(() => {
    if (query.error) {
      console.error(query.error);
      alert("Failed to fetch count");
    }
  }, [query.error]);

  return {
    count,
    loading: query.isFetching,
    reset,
  };
}

export default useItemCount;
