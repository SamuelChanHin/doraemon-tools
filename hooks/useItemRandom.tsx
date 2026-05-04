import { PageType } from "@/components/pages/Home";
import { getDoraemonMovieByRandom, getDoraemonToolByRandom } from "@/lib/api";
import { Movies } from "@/server/database/entity/movie";
import { Tools } from "@/server/database/entity/tools";
import React, { useEffect, useState } from "react";

type Props = {
  page: PageType;
};

function useItemRandom({ page }: Props) {
  const [loading, setLoading] = useState(false);
  const [randomItem, setRandomItem] = useState<(Tools | Movies) | null>(null);

  const reset = () => {
    setRandomItem(null);
    setLoading(false);
  };

  async function fetchRandomItem() {
    setLoading(true);
    try {
      if (page === "TOOL") {
        const r = await getDoraemonToolByRandom();
        setRandomItem(r.data || []);
      } else {
        const r = await getDoraemonMovieByRandom();
        setRandomItem(r.data || []);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch count");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRandomItem();
  }, [page]);

  return {
    randomItem,
    loading,
    reset,
    refetch: fetchRandomItem,
  };
}

export default useItemRandom;
