import styles from '@/styles/RemindersCard.module.css';

const RemindersCard = ({ reminders = [] }) => (
  <div className={styles.remindersCard}>
    <h3>Reminders</h3>
    <div className={styles.reminderList}>
      {reminders.length === 0 ? (
        <div className={styles.empty}>No reminders.</div>
      ) : (
        reminders.map((rem, idx) => (
          <div key={rem.id || idx} className={styles.reminderItem}>
            <div>
              <span className={styles.reminderTitle}>{rem.title}</span>
              <span className={styles.reminderSubtitle}>{rem.subtitle}</span>
            </div>
            <span className={styles.reminderTime}>{rem.time}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

export default RemindersCard;