import styles from '@/styles/SkeletonLoader.module.css';

const SkeletonLoader = ({ type }) => {
  const skeletonTypes = {
    card: (
      <div className={styles.card}>
        <div className={styles.title}></div>
        <div className={styles.line}></div>
        <div className={styles.lineShort}></div>
      </div>
    ),
    list: (
      <div className={styles.list}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className={styles.listItem}></div>
        ))}
      </div>
    ),
    stat: (
      <div className={styles.stat}></div>
    ),
    chart: (
      <div className={styles.chart}></div>
    )
  };

  return skeletonTypes[type] || null;
};


export default SkeletonLoader;