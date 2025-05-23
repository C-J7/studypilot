import { useState, useEffect } from 'react';
import { generateStudyPlan } from '@/app/api/services/api';
import facultiesData from '@/utils/faculties_departments.json';
import styles from '@/styles/StudyPlanner.module.css';

export default function StudyPlanner({ user }) {
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [syllabusId, setSyllabusId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [busyHours, setBusyHours] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  // Auto-select from user profile if available
  useEffect(() => {
    if (user) {
      setFaculty(user.faculty || '');
      setDepartment(user.department || '');
      setLevel(user.level || '');
    }
  }, [user]);

  // Update departments when faculty changes
  useEffect(() => {
    const fac = facultiesData[0].faculties.find(f => f.name === faculty);
    setDepartments(fac ? fac.departments : []);
  }, [faculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      syllabusId,
      startDate,
      endDate,
      userId: user?.id,
      busyHours,
      hoursPerDay,
      preferredTime,
    };
    try {
      const res = await generateStudyPlan(data);
      setPlan(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Time Period */}
        <div className={styles.section}>
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          <label>End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </div>
        {/* Study Preferences */}
        <div className={styles.section}>
          <label>Hours Per Day</label>
          <select value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} required>
            <option value="">Select hours</option>
            {[1,2,3,4,5,6].map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <label>Preferred Time</label>
          <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)}>
            <option value="">Select time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        {/* Course Selection */}
        <div className={styles.section}>
          <label>Faculty</label>
          <select value={faculty} onChange={e => setFaculty(e.target.value)} required>
            <option value="">Select faculty</option>
            {facultiesData[0].faculties.map(f => (
              <option key={f.name} value={f.name}>{f.name}</option>
            ))}
          </select>
          <label>Department</label>
          <select value={department} onChange={e => setDepartment(e.target.value)} required>
            <option value="">Select department</option>
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          <label>Level</label>
          <select value={level} onChange={e => setLevel(e.target.value)} required>
            <option value="">Select level</option>
            {[100,200,300,400,500].map(lvl => (
              <option key={lvl} value={lvl}>{lvl} Level</option>
            ))}
          </select>
        </div>
        {/* Syllabus ID (could be a dropdown if you fetch syllabi for user/faculty/department) */}
        <div className={styles.section}>
          <label>Syllabus</label>
          <input type="text" value={syllabusId} onChange={e => setSyllabusId(e.target.value)} placeholder="Enter Syllabus ID" required />
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Study Plan'}
        </button>
      </form>
      {plan && (
        <div className={styles.planPreview}>
          <h3>Generated Plan</h3>
          {/* Render plan summary here */}
        </div>
      )}
    </div>
  );
}
