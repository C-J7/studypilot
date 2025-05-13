'use client'

import styles from './dashboard.module.css';
import { Home, UploadFile, CalendarToday, BarChart, Logout } from '@mui/icons-material';

const Dashboard = () => {
  return (
    <div className={styles.parentctn + ' flex'}>
      <div className={styles.sidebar + ' flex column'}>
        <h2>StudyPilot</h2>
        <div className={styles.main + ' flex column'}>
              <h3>Welcome to the Dashboard</h3>
        </div>
        <div className={styles.profile + ' flex'}>
          
          <div className={styles.userinfo + ' flex column'}>
            <span id="username">User</span>
            <span id="department">Computer Science</span>
          </div>
        </div>

        <div className={styles.nav + ' flex column'}>
          <a href="/dashboard">
            <div className={styles.navitem + ' flex active'}>
              <Home className={styles.icon + ' home'} />
              <span>Dashboard</span>
            </div>
          </a>

          <a href="/upload">
            <div className={styles.navitem + ' flex'}>
              <UploadFile className={styles.icon + ' upload'} />
              <span>Upload Syllabus</span>
            </div>
          </a>

          <a href="/study-planner">
            <div className={styles.navitem + ' flex'}>
              <CalendarToday className={styles.icon + ' calendar-w'} />
              <span>Study Planner</span>
            </div>
          </a>

          <a href="/progress">
            <div className={styles.navitem + ' flex'}>
              <BarChart className={styles.icon + ' bars'} />
              <span>Progress</span>
            </div>
          </a>

          <a href="#" className={styles.logoutctn}>
            <div className={styles.navitem + ' flex'}>
              <Logout className={styles.icon + ' logout'} />
              <span id="logoutbtn">Logout</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
