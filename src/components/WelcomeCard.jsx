'use client'
import { motion } from 'framer-motion';
import styles from '@/styles/WelcomeCard.module.css';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const WelcomeCard = ({ userName, progress = 0, nextUp }) => {
  const firstName = userName?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <motion.div
      className={styles.welcomeCard}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.greeting}>
        <span className={styles.date}>{today}</span>
        <h2>{greeting()}, {firstName}</h2>
        <p>{nextUp ? <>Next up: <strong>{nextUp}</strong></> : 'You are all caught up. Add a course to plan what is next.'}</p>
      </div>
      <div className={styles.progress}>
        <div className={styles.progressHead}>
          <span>Plan progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className={styles.progressBarContainer}>
          <motion.div
            className={styles.progressBarFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
