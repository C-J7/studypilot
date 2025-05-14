'use client'

import { useEffect, useState } from 'react'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import api from '../api/services/api'
import styles from './dashboard.module.css'
import { useAuth } from '@/contexts/AuthContext'
import WelcomeCard from '@/components/WelcomeCard' 

export default function Dashboard() {
  const { user } = useAuth() 
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [overallProgress, setOverallProgress] = useState(0) //State for overall progress

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        setLoading(true); 
        try {
          
          const mockProgress = Math.floor(Math.random() * 75) + 25; 
          setOverallProgress(mockProgress);

          const userId = user.id;
          const [syllabiRes, plansRes] = await Promise.all([
            api.get(`/api/syllabus/user/${userId}`),
            api.get(`/api/study-plan/user/${userId}`)
          ]);
          setStats({
            courses: syllabiRes.data.length,
            currentStreak: 5, //Placeholder
            longestStreak: 7, //Placeholder
            studyHours: 14,   //Placeholder
            upcomingSessions: plansRes.data.flatMap(plan => plan.sessions).length
          });
        } catch (error) {
          console.error('Dashboard error:', error);
          setStats(null); 
          setOverallProgress(0); //Reset progress on error
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); 
        setStats(null);   
        setOverallProgress(0); 
      }
    };

    fetchData();
  }, [user]);

  //Handle loading state
  if (loading) {
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
        <div className={styles.upcomingSessions}>
          <h4>Upcoming Sessions</h4>
          <SkeletonLoader type="list" />
        </div>
      </div>
    );
  }

  const userNameForWelcomeCard = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <div className={styles.container}>
      <WelcomeCard userName={userNameForWelcomeCard} progress={overallProgress} />
      
      {/* Conditional rendering for the rest of the dashboard based on stats availability */}
      {!stats ? (
        <p className={styles.dataMessage}>Could not load detailed dashboard statistics. Please try refreshing.</p>
      ) : (
        <>
          <div className={styles.statsGrid}>
              <>
                <div className={styles.statCard}>
                  <h4>Total Courses</h4>
                  <p>{stats.courses}</p>
                </div>
                <div className={styles.statCard}>
                  <h4>Current Streak</h4>
                  <p>{stats.currentStreak} days</p>
                </div>
                <div className={styles.statCard}>
                  <h4>Longest Streak</h4>
                  <p>{stats.longestStreak} days</p>
                </div>
                <div className={styles.statCard}>
                  <h4>Study Hours</h4>
                  <p>{stats.studyHours}h</p>
                </div>
              </>
          </div>

          <div className={styles.chartSection}>
            <h4>Weekly Study Time</h4>
            <div className={styles.chartContainer}>
              {/* Chart.js implementation would go here */}
              <div className={styles.chartPlaceholder} />
            </div>
          </div>

          <div className={styles.upcomingSessions}>
            <h4>Upcoming Sessions</h4>
            {stats.upcomingSessions > 0 ? (
              <div className={styles.sessionList}>
                {[...Array(stats.upcomingSessions)].map((_, i) => (
                  <div key={i} className={styles.sessionItem}>
                    <span>CSC 21{i} - Session {i + 1}</span>
                    <span>Tomorrow 2:00 PM</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No upcoming sessions. Generate a study plan!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}