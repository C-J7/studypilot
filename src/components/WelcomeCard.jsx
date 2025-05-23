'use client'
import { motion } from 'framer-motion';
import styles from '@/styles/WelcomeCard.module.css';

const WelcomeCard = ({ userName, progress = 0 }) => {
  const firstName = userName?.split(' ')[0] || 'User';

  return (
    <motion.div
      className={styles.welcomeCard}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.greeting}>
        <h2>Welcome, {firstName}!</h2>
        <p>
          You have completed <span className={styles.progressPercentage}>{progress}%</span> of your goals.
        </p>
      </div>
      <div className={styles.progressBarContainer}>
        <motion.div
          className={styles.progressBarFill}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default WelcomeCard;