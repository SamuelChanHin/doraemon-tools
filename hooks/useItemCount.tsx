import { PageType } from "@/components/pages/Home";
import { getDoraemonMovieCount, getDoraemonToolCount } from "@/lib/api";
import { useEffect, useState } from "react";

type Props = {
  page: PageType;
};

function useItemCount({ page }: Props) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setCount(0);
    setLoading(false);
  };

  async function fetchCount() {
    setLoading(true);
    try {
      if (page === "TOOL") {
        const r = await getDoraemonToolCount();
        setCount(r.data || 0);
      } else {
        const r = await getDoraemonMovieCount();
        setCount(r.data || 0);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch count");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCount();
  }, [page]);

  return { count, loading, reset };
}

export default useItemCount;
