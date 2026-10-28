import { useState } from 'react';
import styles from '@/styles/RemindersCard.module.css';

const RemindersCard = ({ reminders = [] }) => {
  const [busyId, setBusyId] = useState(null);

  const complete = async (rem) => {
    setBusyId(rem.id);
    try {
      await rem.onComplete();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={styles.remindersCard}>
      <h3>Up Next</h3>
      <div className={styles.reminderList}>
        {reminders.length === 0 ? (
          <div className={styles.empty}>Nothing scheduled. Generate a study plan to get started.</div>
        ) : (
          reminders.map((rem, idx) => (
            <div key={rem.id || idx} className={styles.reminderItem}>
              <div>
                <span className={styles.reminderTitle}>{rem.title}</span>
                <span className={styles.reminderSubtitle}>{rem.subtitle}</span>
                <span className={styles.reminderTime}>{rem.time}</span>
              </div>
              {rem.onComplete && (
                <button
                  type="button"
                  className={styles.doneButton}
                  onClick={() => complete(rem)}
                  disabled={busyId === rem.id}
                  aria-label={`Mark ${rem.title} as done`}
                >
                  {busyId === rem.id ? 'Saving...' : 'Done'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RemindersCard;
