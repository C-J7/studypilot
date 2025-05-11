// Reminders Card Component: List of reminders 
import styles from "../styles/RemindersCard.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RemindersCard() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get("https://studypilot-backend.onrender.com/api/Reminders");
        const formattedReminders = response.data.map(reminder => ({
          id: reminder.id,
          text: reminder.text,
          dueDate: reminder.dueDate,
        }));
        setReminders(formattedReminders);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, []);

  if (isLoading) {
    return <div>Loading reminders...</div>;
  }

  return (
    <div className={styles.remindersCard}>
      <h3>Reminders</h3>
      <ul className={styles.remindersList}>
        {reminders.map((reminder) => (
          <li key={reminder.id} className={styles.reminderItem}>
            <div className={styles.reminderText}>{reminder.text}</div>
            <div className={styles.reminderDueDate}>Due: {reminder.dueDate}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}