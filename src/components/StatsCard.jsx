// Quick Stats Card Component
import styles from "../styles/StatsCard.module.css";
import Card from "./BaseCard"; 
import Progress from "./ProgessDisplay";

function StatsCard({ coursesCount, currentStreak, longestStreak }) {
    return (
      <Card title="Quick Stats" className={styles.statsCard}>
        <div className={styles.statsList}>
          <div>
            <div className={styles.statItemHeader}>
              <span>Courses</span>
              <span>{coursesCount}</span>
            </div>
            <Progress value={coursesCount > 0 ? 100 : 0} />
          </div>
          <div>
            <div className={styles.statItemHeader}>
              <span>Current Streak</span>
              <span>{currentStreak} days</span>
            </div>
            <Progress value={(currentStreak / (longestStreak || 1)) * 100} /> {/* Simple percentage of longest */} 
          </div>
          <div>
            <div className={styles.statItemHeader}>
              <span>Longest Streak</span>
              <span>{longestStreak} days</span>
            </div>
            <Progress value={100} /> {/* Longest streak is always 100% of itself */} 
          </div>
        </div>
      </Card>
    );
  }

  export default StatsCard;