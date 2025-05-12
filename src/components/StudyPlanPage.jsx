import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from '../app/dashboard/dashboard.module.css'; 

export default function StudyPlanPage({ userId, syllabusId }) {
  const [studyPlans, setStudyPlans] = useState([]);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', busyHours: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchStudyPlans();
  }, []);

  const fetchStudyPlans = async () => {
    try {
      const response = await axios.get(`/api/study-plan/user/${userId}`);
      setStudyPlans(response.data);
    } catch (err) {
      console.error('Error fetching study plans:', err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/study-plan/generate', {
        ...formData,
        syllabusId,
        userId,
      });
      if (response.status !== 200) {
      setSuccess('Study plan generated successfully!');
      fetchStudyPlans();}
    } catch (err) {
      setError('Error generating study plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (studyPlanId, sessionId, completed) => {
    try {
      await axios.put(`/api/study-plan/${studyPlanId}/session/${sessionId}`, { completed });
      fetchStudyPlans();
    } catch (err) {
      console.error('Error updating session progress:', err);
    }
  };

  return (
    <motion.div className={styles.studyPlanPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className={styles.pageTitle}>Study Plan Management</h1>

      <div className={styles.generateSection}>
        <h2 className={styles.sectionTitle}>Generate Study Plan</h2>
        <form onSubmit={handleGenerate} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="busyHours">Busy Hours (JSON format)</label>
            <textarea
              id="busyHours"
              placeholder='{"Monday": ["10:00-12:00"]}'
              value={JSON.stringify(formData.busyHours)}
              onChange={(e) => setFormData({ ...formData, busyHours: JSON.parse(e.target.value) })}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>Generate</button>
        </form>
        {loading && <p className={styles.loadingText}>Generating...</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        {success && <p className={styles.successText}>{success}</p>}
      </div>

      <div className={styles.studyPlansSection}>
        <h2 className={styles.sectionTitle}>Your Study Plans</h2>
        {studyPlans.length > 0 ? (
          <ul className={styles.studyPlansList}>
            {studyPlans.map((plan) => (
              <li key={plan.id} className={styles.studyPlanItem}>
                <h3 className={styles.studyPlanTitle}>{plan.title}</h3>
                <ul className={styles.sessionsList}>
                  {plan.sessions.map((session) => (
                    <li key={session.id} className={styles.sessionItem}>
                      {session.title} - {session.completed ? 'Completed' : 'Pending'}
                      <input
                        type="checkbox"
                        checked={session.completed}
                        onChange={(e) => handleProgressUpdate(plan.id, session.id, e.target.checked)}
                      />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noPlansText}>No study plans found.</p>
        )}
      </div>

      <div className={styles.remindersSection}>
        <h2 className={styles.sectionTitle}>Reminders</h2>
        <button className={styles.remindersButton} onClick={() => alert('Coming soon.')}>Sync with Google Calendar</button>
      </div>
    </motion.div>
  );
}