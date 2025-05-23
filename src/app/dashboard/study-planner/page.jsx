"use client";
import { useState, useEffect } from 'react';
import { generateStudyPlan } from '@/app/api/services/api';
import facultiesData from '@/utils/faculties_departments.json';
import CustomDropdown from '@/components/CustomDropdown';
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
  const [showForm, setShowForm] = useState(true);

  //Auto-select from user profile if available
  useEffect(() => {
    if (user) {
      setFaculty(user.faculty || '');
      setDepartment(user.department || '');
      setLevel(user.level || '');
      setSyllabusId == 1;
    }
  }, [user]);

  //Update departments when faculty changes
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
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
    setPlan(null);
  };

  return (
    <div className={styles.container}>
      {showForm ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          {/*Time Period */}
          <div className={styles.section}>
            <label>Start Date</label>
            <div className={styles.dateInputWrapper}>
              <input
                type="date"
                className={styles.dateInput}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
            </div>
            <label>End Date</label>
            <div className={styles.dateInputWrapper}>
              <input
                type="date"
                className={styles.dateInput}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
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
          {/*Course Selection */}
          <div className={styles.section}>
            <label>Faculty</label>
            <CustomDropdown
              options={facultiesData[0].faculties.map(f => f.name)}
              value={faculty}
              onChange={val => {
                setFaculty(val);
                setDepartment('');
              }}
              placeholder="Select faculty"
              label=""
            />
            <label>Department</label>
            <CustomDropdown
              options={departments}
              value={department}
              onChange={setDepartment}
              placeholder="Select department"
              label=""
            />
            <label>Level</label>
            <CustomDropdown
              options={[100,200,300,400,500].map(lvl => `${lvl} Level`)}
              value={level ? `${level} Level` : ''}
              onChange={val => setLevel(val.replace(' Level',''))}
              placeholder="Select level"
              label=""
            />
          </div>
          {/*Syllabus ID (could be a dropdown, might later remove or use the title instead.*/}
          {/* <div className={styles.section}>
            <label>Syllabus</label>
            {/* Use 1 for now since demo */}
            {/* <input type="text" value={syllabusId} onChange={e => setSyllabusId(e.target.value)} placeholder="Enter Syllabus ID" required /> */}
          {/* </div> */} 
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Study Plan'}
          </button>
        </form>
      ) : (
        plan && (
          <div className={styles.planPreview}>
            <h3>Study Plan</h3>
            <div className={styles.planList}>
              {plan.sessions && plan.sessions.map(session => (
                <div key={session.id} className={styles.planCard}>
                  <div className={styles.planTopic}>{session.topic}</div>
                  <div className={styles.planTime}>
                    {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}
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
              onClick={handleShowForm}
              title="Generate a new studyplan"
              type="button"
            >
              Generate New studyplan
            </button>
          </div>
        )
      )}
    </div>
  );
}
