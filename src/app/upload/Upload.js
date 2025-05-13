import React from 'react';
import styles from './upload.module.css';

const Upload = () => {
  return (
    <div className={styles['parent-ctn'] + ' flex'}>
      <aside className={styles.sidebar + ' flex column'}>
        <h2>StudyPilot</h2>
        <div className={styles.profile + ' flex'}>
          <div className={styles['profile-img-ctn']}>
            <img id="profile-image" src="" alt="Profile" />
          </div>
          <div className={styles['user-info'] + ' flex column'}>
            <span id="username">John Doe</span>
            <span id="department">Computer Science</span>
          </div>
        </div>
        <div className={styles.nav + ' flex column'}>
          <a href="/dashboard">
            <div className={styles['nav-item'] + ' flex'}>
              <img className={styles.icon + ' home'} src="/src/app/Frontend/icons/home.png" alt="Home" />
              <span>Dashboard</span>
            </div>
          </a>
          <a href="/upload">
            <div className={styles['nav-item'] + ' flex active'}>
              <img className={styles.icon + ' upload'} src="/src/app/Frontend/icons/upload.png" alt="Upload" />
              <span>Upload Syllabus</span>
            </div>
          </a>
          <a href="/study-planner">
            <div className={styles['nav-item'] + ' flex'}>
              <img className={styles.icon + ' calendar-w'} src="/src/app/Frontend/icons/calendar-w.png" alt="Study Planner" />
              <span>Study Planner</span>
            </div>
          </a>
          <a href="/progress">
            <div className={styles['nav-item'] + ' flex'}>
              <img className={styles.icon + ' bars'} src="/src/app/Frontend/icons/progress.png" alt="Progress" />
              <span>Progress</span>
            </div>
          </a>
        </div>
      </aside>
      <div className={styles.main + ' flex column'}>
        <h3>Upload Your Syllabus</h3>
      </div>
    </div>
  );
};

export default Upload;
