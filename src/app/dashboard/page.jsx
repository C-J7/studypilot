'use client'

import { useCallback, useEffect, useState } from 'react';
import { fetchAllDashboardData, setSessionCompleted, errorMessage } from '@/app/api/services/api';
import SkeletonLoader from '@/components/SkeletonLoader'
import styles from './dashboard.module.css'
import { useAuth } from '@/contexts/AuthContext'
import WelcomeCard from '@/components/WelcomeCard'
import BaseCard from '@/components/BaseCard';
import RemindersCard from '@/components/RemindersCard';
import StudyChartCard from '@/components/StudyChartCard';
import TopCoursesCard from '@/components/TopCoursesCard';

const formatSessionTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setError(null);
    return fetchAllDashboardData(user.id)
      .then(setData)
      .catch(err => setError(errorMessage(err, 'Could not load your dashboard.')));
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const completeSession = async (session) => {
    try {
      await setSessionCompleted(session.studyPlanId, session.id, true);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  if (error && !data) {
    return (
      <div className={styles.dataMessage}>
        <p>{error}</p>
        <button type="button" onClick={load}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        {/* Welcome card skeleton */}
        <div className={styles.welcomeCardSkeleton}></div>
        <div className={styles.statsGrid}>
          {[...Array(4)].map((_, i) => <SkeletonLoader key={i} type="card" />)}
        </div>
        <div className={styles.chartSection}>
          <h4>Weekly Study Time</h4>
          <SkeletonLoader type="chart" />
        </div>
      </div>
    );
  }

  const { progress, syllabi, upcoming } = data;
  const userNameForWelcomeCard = user?.user_metadata?.full_name || user?.email || 'User';

  const quickStats = [
    { label: 'Courses', value: syllabi.length, max: 5, suffix: '' },
    { label: 'Current Streak', value: progress.currentStreak, max: 30, suffix: ' days' },
    { label: 'Longest Streak', value: progress.longestStreak, max: 30, suffix: ' days' },
    { label: 'Hours This Week', value: progress.hoursThisWeek, max: 14, suffix: ' h' },
  ];

  const reminders = upcoming.map(s => ({
    id: s.id,
    title: s.topic,
    subtitle: s.course,
    time: formatSessionTime(s.startTime),
    onComplete: () => completeSession(s),
  }));

  return (
    <div className={styles.dashboardGrid}>
      <div className={styles.welcomeArea}>
        <WelcomeCard userName={userNameForWelcomeCard} progress={progress.overallProgress} />
      </div>
      <BaseCard className={styles.quickStatsCard}>
        <h3>Quick Statistics</h3>
        {quickStats.map(stat => (
          <div key={stat.label} className={styles.statRow}>
            <span>{stat.label}</span>
            <span>{stat.value}{stat.suffix}</span>
            <div className={styles.statBar}>
              <div className={styles.statBarFill} style={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%` }} />
            </div>
          </div>
        ))}
      </BaseCard>
      <BaseCard className={styles.chartCard}>
        <h3>Time Spent Studying</h3>
        <StudyChartCard days={progress.dailyProgress} />
      </BaseCard>
      <div className={styles.coursesArea}>
        <TopCoursesCard courses={syllabi} progress={progress.courses} />
      </div>
      <div className={styles.upNextArea}>
        <RemindersCard reminders={reminders} />
      </div>
    </div>
  );
}
