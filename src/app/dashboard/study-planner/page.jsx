"use client";
import { useState, useEffect } from 'react';
import { generateStudyPlan, getUserSyllabi, errorMessage } from '@/app/api/services/api';
import { useAuth } from '@/contexts/AuthContext';
import CustomDropdown from '@/components/CustomDropdown';
import styles from '@/styles/StudyPlanner.module.css';

const today = () => new Date().toISOString().slice(0, 10);

export default function StudyPlanner() {
  const { user } = useAuth();
  const [syllabi, setSyllabi] = useState([]);
  const [syllabusId, setSyllabusId] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('2');
  const [preferredTime, setPreferredTime] = useState('evening');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!user) return;
    getUserSyllabi(user.id)
      .then(res => {
        setSyllabi(res.data);
        if (res.data.length) setSyllabusId(String(res.data[0].id));
      })
      .catch(err => setError(errorMessage(err, 'Could not load your syllabi.')));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await generateStudyPlan({
        syllabusId: Number(syllabusId),
        userId: user.id,
        startDate,
        endDate,
        hoursPerDay: Number(hoursPerDay),
        preferredTime,
        busyHours: {},
      });
      setPlan(res.data);
    } catch (err) {
      setError(errorMessage(err, 'Could not generate a plan.'));
    } finally {
      setLoading(false);
    }
  };

  if (plan) {
    return (
      <div className={styles.container}>
        <div className={styles.planPreview}>
          <h3>{plan.syllabusTitle}: {plan.sessions.length} sessions</h3>
          <div className={styles.planList}>
            {plan.sessions.map(session => (
              <div key={session.id} className={styles.planCard}>
                <div className={styles.planTopic}>{session.topic}</div>
                <div className={styles.planTime}>
                  {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleTimeString()}
                </div>
                <div className={styles.planStatus}>
                  {session.completed ? <span className={styles.completed}>Completed</span> : <span className={styles.pending}>Pending</span>}
                </div>
              </div>
            ))}
          </div>
          <button
            className={styles.button}
            style={{ marginTop: '2rem', position: 'relative' }}
            onClick={() => setPlan(null)}
            title="Generate a new study plan"
            type="button"
          >
            Generate New Study Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/*Course Selection */}
        <div className={styles.section}>
          <label htmlFor="syllabus">Syllabus</label>
          {syllabi.length ? (
            <select id="syllabus" className={styles.dateInput} value={syllabusId} onChange={e => setSyllabusId(e.target.value)} required>
              {syllabi.map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.topics.length} topics)</option>
              ))}
            </select>
          ) : (
            <p>Upload a syllabus first, then come back to plan it.</p>
          )}
        </div>
        {/*Time Period */}
        <div className={styles.section}>
          <label htmlFor="start">Start Date</label>
          <div className={styles.dateInputWrapper}>
            <input id="start" type="date" className={styles.dateInput} value={startDate}
              onChange={e => setStartDate(e.target.value)} required />
          </div>
          <label htmlFor="end">End Date</label>
          <div className={styles.dateInputWrapper}>
            <input id="end" type="date" className={styles.dateInput} value={endDate} min={startDate}
              onChange={e => setEndDate(e.target.value)} required />
          </div>
        </div>
        {/*Study Preferences */}
        <div className={styles.section}>
          <label>Hours Per Day</label>
          <CustomDropdown
            options={["1", "2", "3", "4", "5", "6", "7", "8"]}
            value={hoursPerDay}
            onChange={setHoursPerDay}
            placeholder="Select hours"
            label=""
          />
          <label>Preferred Time</label>
          <CustomDropdown
            options={["morning", "afternoon", "evening"]}
            value={preferredTime}
            onChange={setPreferredTime}
            placeholder="Select time"
            label=""
          />
        </div>
        {error && <div role="alert" style={{ color: '#b91c1c', marginBottom: '1rem' }}>{error}</div>}
        <button className={styles.button} type="submit" disabled={loading || !syllabi.length}>
          {loading ? 'Generating...' : 'Generate Study Plan'}
        </button>
      </form>
    </div>
  );
}
