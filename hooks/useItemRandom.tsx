import { PageType } from "@/components/pages/Home";
import { getDoraemonMovieByRandom, getDoraemonToolByRandom } from "@/lib/api";
import { Movies } from "@/server/database/entity/movie";
import { Tools } from "@/server/database/entity/tools";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

type Props = {
  page: PageType;
};

function useItemRandom({ page }: Props) {
  const [randomItem, setRandomItem] = useState<(Tools | Movies) | null>(null);

  const reset = () => {
    setRandomItem(null);
  };

  const query = useQuery({
    queryKey: ["item-random", page],
    queryFn: async () => {
      if (page === "TOOL") {
        const response = await getDoraemonToolByRandom();
        return response.data || null;
      }

      const response = await getDoraemonMovieByRandom();
      return response.data || null;
    },
    retry: false,
  });

  useEffect(() => {
    setRandomItem(query.data || null);
  }, [query.data]);

  useEffect(() => {
    if (query.isError) {
      console.error(query.error);
      alert("Failed to fetch random item");
    }
  }, [query.error, query.isError]);

  return {
    randomItem,
    loading: query.isFetching,
    reset,
    refetch: () => query.refetch()
  };
}

export default useItemRandom;
