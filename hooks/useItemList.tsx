import { PageType } from "@/components/pages/Home";
import { getDoraemonMovies, getDoraemonTools } from "@/lib/api";
import { Movies } from "@/server/database/entity/movie";
import { Tools } from "@/server/database/entity/tools";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  page: PageType;
};

function useItemList({ page }: Props) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<(Tools | Movies)[]>([]);
  const listPage = useRef(1);

  const reset = () => {
    setList([]);
    listPage.current = 1;
    setLoading(false);
    loadMore();
  };

  async function loadMore() {
    try {
      setLoading(true);
      const params = { page: listPage.current, pageSize: 10 };
      let r;
      if (page === "TOOL") r = await getDoraemonTools(params);
      else r = await getDoraemonMovies(params);
      const items = r.data || [];
      if (items.length > 0) {
        setList((s) => s.concat(items));
        listPage.current += 1;
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load more");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    reset();
  }, [page]);

  return {
    list,
    loadMore,
    loading,
    reset,
  };
}

export default useItemList;
