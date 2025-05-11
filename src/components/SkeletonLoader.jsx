import styles from "../styles/SkeletonLoader.module.css";
function SkeletonLoader() {
  return (
    <div className={`${styles.skeletonContainer} ${styles.skeletonPulse}`}>
    <div className={`${styles.skeletonHeightSmall} ${styles.skeletonBackground} ${styles.skeletonRounded}`}></div>
    <div className={`${styles.skeletonGrid} ${styles.skeletonGridCols1} ${styles.skeletonGap}`}>
      <div className={`${styles.skeletonHeightLarge} ${styles.skeletonBackground} ${styles.skeletonRounded}`}></div>
      <div className={`${styles.skeletonHeightLarge} ${styles.skeletonBackground} ${styles.skeletonRounded}`}></div>
    </div>
    <div className={`${styles.skeletonHeightLarge} ${styles.skeletonBackground} ${styles.skeletonRounded}`}></div>
    </div>
  );
}


export default SkeletonLoader;