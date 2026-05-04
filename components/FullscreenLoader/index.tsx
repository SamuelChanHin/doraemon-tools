import React from "react";
import styles from "./index.module.scss";

function FullscreenLoader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  );
}

export default FullscreenLoader;
