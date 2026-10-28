import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
      <div className={styles.head}>
        <h3>Up Next</h3>
        {reminders.length > 0 && <span className={styles.count}>{reminders.length}</span>}
      </div>
      {reminders.length === 0 ? (
        <div className={styles.empty}>Nothing scheduled. Generate a study plan to get started.</div>
      ) : (
        <ul className={styles.reminderList}>
          <AnimatePresence initial={false}>
            {reminders.map((rem) => (
              <motion.li
                key={rem.id}
                layout
                className={styles.reminderItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
              >
                <span className={styles.reminderTime}>{rem.time}</span>
                <span className={styles.reminderTitle}>{rem.title}</span>
                <span className={styles.reminderSubtitle}>{rem.subtitle}</span>
                {rem.onComplete && (
                  <button
                    type="button"
                    className={styles.doneButton}
                    onClick={() => complete(rem)}
                    disabled={busyId === rem.id}
                    aria-label={`Mark ${rem.title} as done`}
                    title="Mark as done"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default RemindersCard;
