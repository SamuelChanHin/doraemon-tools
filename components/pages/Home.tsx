"use client";
import useItemCount from "@/hooks/useItemCount";
import useItemList from "@/hooks/useItemList";
import useItemRandom from "@/hooks/useItemRandom";
import clsx from "clsx";
import React, { useMemo, useRef, useState } from "react";
import Header from "../Header";
import { BottomLoader, SkeletonCard } from "../LoadingState";
import styles from "./Home.module.scss";

export type DisplayMode = "SINGLE" | "MULTIPLE";
export type PageType = "TOOL" | "MOVIE";

const SCROLL_THRESHOLD = 2000;
const INFINITE_SCROLL_BOTTOM_THRESHOLD = 10;

export default function Home() {
  const [page, setPage] = useState<PageType>("TOOL");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("SINGLE");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const multipleModeRef = useRef<HTMLDivElement>(null);

  const { count, loading: countLoading } = useItemCount({
    page,
  });
  const {
    randomItem,
    loading: randomLoading,
    refetch: refetchRandom,
  } = useItemRandom({
    page,
  });
  const {
    list,
    loading: listLoading,
    loadMore,
  } = useItemList({
    page,
  });

  const isLoading = useMemo(
    () => countLoading || randomLoading,
    [countLoading, randomLoading],
  );
  const isInitialMultipleLoading = displayMode === "MULTIPLE" && listLoading && list.length === 0;
  const isLoadingMore = displayMode === "MULTIPLE" && listLoading && list.length > 0;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // Show/hide back-to-top button based on scroll position
    setShowBackToTop(scrollTop > SCROLL_THRESHOLD);

    // Infinite scroll: load more when near bottom
    if (
      scrollHeight - scrollTop - clientHeight <
      INFINITE_SCROLL_BOTTOM_THRESHOLD
    ) {
      loadMore();
    }
  };

  const scrollToTop = () => {
    if (multipleModeRef.current) {
      multipleModeRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const switchMode = () => {
    setDisplayMode((d) => (d === "SINGLE" ? "MULTIPLE" : "SINGLE"));
    if (displayMode === "SINGLE") {
      // Switching to multiple mode, load initial items
      setTimeout(() => loadMore(), 0);
    }
  };

  const switchPage = (newPage: PageType) => {
    setPage(newPage);
  };

  return (
    <div className={styles.container}>
      <Header count={count} switchMode={switchMode} />

      {/* Content */}
      <main className={styles.content}>
        {displayMode === "SINGLE" && (
          <div className={clsx(styles.singleMode)}>
            <div className={styles.toolContainer}>
              <div className={styles.card}>
                {(isLoading || !randomItem) ? (
                  <SkeletonCard variant="single" />
                ) : (
                  <>
                    <div className={styles.cardImageContainer}>
                      <img
                        src={randomItem.imageUrl}
                        className={styles.cardImage}
                        alt={randomItem.nameTc || randomItem.nameJp}
                      />
                    </div>
                    <div className={styles.cardTitle}>
                      {randomItem.nameTc || randomItem.nameJp}
                    </div>
                    <div className={styles.cardDescription}>
                      {randomItem.descriptionTc || randomItem.descriptionJp}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Refetch Bar + Button */}
            <div className={styles.refetchButtonContainer}>
              <div className={styles.refetchBell} />
              <button
                className={styles.refetchButton}
                onClick={refetchRandom}
                title="Fetch a new random item"
              >
                <i className="fa-solid fa-rotate"></i>
              </button>
            </div>
          </div>
        )}

        {displayMode === "MULTIPLE" && (
          <div
            className={styles.multipleMode}
            onScroll={handleScroll}
            ref={multipleModeRef}
          >
            <div className={styles.toolsContainer}>
              {isInitialMultipleLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <div key={`skeleton-${i}`} className={styles.card}>
                      <SkeletonCard variant="grid" />
                    </div>
                  ))
                : list.map((it) => (
                    <div key={it.id} className={styles.card}>
                      <div className={styles.cardImageContainer}>
                        <img
                          src={it.imageUrl}
                          className={styles.cardImage}
                          alt={it.nameTc || it.nameJp}
                        />
                      </div>
                      <div className={styles.cardTitle}>
                        {it.nameTc || it.nameJp}
                      </div>
                    </div>
                  ))}
            </div>
            {isLoadingMore && <BottomLoader />}
          </div>
        )}
      </main>

      {/* Back-to-Top Button */}
      <button
        className={clsx(styles.backToTopButton, {
          [styles.visible]: showBackToTop,
          [styles.opacity]: !showBackToTop,
        })}
        onClick={scrollToTop}
        title="Back to top"
      >
        Top
      </button>

      {/* Footer Navigation */}
      <footer className={styles.footer}>
        <div className={styles.bottomNavigation}>
          <button
            className={clsx(styles.navigationItem, {
              [styles.activeItem]: page === "TOOL",
            })}
            onClick={() => switchPage("TOOL")}
            title="View tools"
          >
            <i className="fa-solid fa-gear"></i>
          </button>
          <button
            className={clsx(styles.navigationItem, {
              [styles.activeItem]: page === "MOVIE",
            })}
            onClick={() => switchPage("MOVIE")}
            title="View movies"
          >
            <i className="fa-solid fa-film"></i>
          </button>
        </div>
      </footer>
    </div>
  );
}
