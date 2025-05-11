// Welcome Card Component
import axios from "axios";
import styles from "../styles/WelcomeCard.module.css";
import { useEffect, useState } from "react";
import ProgressDisplay from "./ProgessDisplay";
import BaseCard from "./BaseCard";

function WelcomeCard({ progress: initialProgress, userName: initialUserName }) {
  const [user, setUser] = useState(initialUserName);
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    axios.get("https://studypilot-backend.onrender.com/api/user")
      .then((res) => setUser(res.data.name))
      .catch(() => setUser("User"));
  }, []);

  return (
    <BaseCard className={styles.welcomeCard}>
      <div className={styles.welcomeContentContainer}>
        <div className={styles.welcomeTextContainer}>
          <h2 className={styles.welcomeTitle}>WELCOME, {user?.toUpperCase() || "USER"}</h2>
          <p className={styles.welcomeSubtitle}>
            You have successfully completed {progress}% of studies. Keep it up!
          </p>
          <ProgressDisplay value={progress} className={styles.welcomeProgress} />
        </div>
        <div className={styles.welcomeImagePlaceholder}>
          <p style={{ textAlign: 'center', paddingTop: '45px' }}>Icon</p>
        </div>
      </div>
    </BaseCard>
  );
}

export default WelcomeCard;