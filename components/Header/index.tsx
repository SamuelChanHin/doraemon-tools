import clsx from "clsx";
import styles from "./index.module.scss";

type Props = {
  count: number;
  switchMode: () => void;
};

function Header({ count, switchMode }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.navbar}>
        <span className={styles.toolCount}>{count}</span>

        <button className={styles.displayModeToggle} onClick={switchMode}>
          <i className={clsx("fa-solid fa-list")}></i>
        </button>
      </div>
    </header>
  );
}

export default Header;
