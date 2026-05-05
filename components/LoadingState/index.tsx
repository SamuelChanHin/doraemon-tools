import React from "react";
import styles from "./index.module.scss";

type SkeletonCardProps = {
  variant?: "single" | "grid";
};

export function SkeletonCard({ variant = "single" }: SkeletonCardProps) {
  return (
    <>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonTitle} />
      {variant === "single" && (
        <>
          <div className={styles.skeletonDescription} />
          <div
            className={`${styles.skeletonDescription} ${styles.skeletonShort}`}
          />
        </>
      )}
    </>
  );
}

export function BottomLoader() {
  return (
    <div className={styles.bottomLoader}>
      <div className={styles.bottomLoaderSpinner} />
    </div>
  );
}
