'use client'

import { useEffect, useState } from 'react';
import { fetchAllDashboardData } from '@/app/api/services/api';
import SkeletonLoader from '@/components/SkeletonLoader'
import styles from './dashboard.module.css'
import { useAuth } from '@/contexts/AuthContext'
import WelcomeCard from '@/components/WelcomeCard' 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SearchBar from '@/components/SearchBar';
import BaseCard from '@/components/BaseCard';
import RemindersCard from '@/components/RemindersCard';
import StudyChartCard from '@/components/StudyChartCard';
import TopCoursesCard from '@/components/TopCoursesCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchAllDashboardData(user.id).then(res => {
      if (mounted) setData(res);
    });
    return () => { mounted = false; };
  }, [user.id]);

  const chartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Study Hours',
        data: [2, 3, 1.5, 4, 2.5, 3, 1], 
        backgroundColor: 'rgba(30, 58, 138, 0.8)', 
        borderRadius: 4,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Study Time',
      },
    },
  };

  //Search syllabus by faculty/department
  const handleSearch = async (faculty, department, query) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      //Query syllabus table for user's faculty/department
      const { data, error } = await supabase
        .from('syllabus')
        .select('*')
        .eq('faculty', faculty)
        .eq('department', department)
        .ilike('title', `%${query}%`);
      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      setSearchError('Failed to search syllabus.');
    } finally {
      setSearchLoading(false);
    }
  };

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
        <div className={styles.upcomingSessions}>
          <h4>Upcoming Sessions</h4>
          <SkeletonLoader type="list" />
        </div>
      </div>
    );
  } 

  const { progress, planner, syllabus, reminders, loading, error } = data;

  if (error) {
    return <div className="dataMessage">{error}</div>;
  }

  const userNameForWelcomeCard = user?.user_metadata?.full_name || user?.email || 'User';

  //Quick stats
  const quickStats = [
    { label: 'Courses', value: syllabus ? syllabus.length : 0 },
    { label: 'Current Streak', value: `${progress?.[0]?.current_streak || 0} days` },
    { label: 'Longest Streak', value: `${progress?.[0]?.longest_streak || 0} days` },
  ];

  return (
    <div className={styles.dashboardGrid}>
      <div style={{ gridColumn: '1 / 4' }}>
        <WelcomeCard userName={userNameForWelcomeCard} progress={progress?.[0]?.overall_progress || 0} />
      </div>
      <BaseCard className={styles.quickStatsCard}>
        <h3>Quick Statistics</h3>
        {quickStats.map(stat => {
          let percent = 0;
          if (stat.label === 'Courses') {
            percent = Math.min((stat.value / 5) * 100, 100);
          } else if (stat.label === 'Current Streak') {
            const days = parseInt(stat.value);
            percent = Math.min((days / 30) * 100, 100);
          } else if (stat.label === 'Longest Streak') {
            const days = parseInt(stat.value);
            percent = Math.min((days / 30) * 100, 100);
          }
          return (
            <div key={stat.label} className={styles.statRow}>
              <span>{stat.label}</span>
              <span>{stat.value}</span>
              <div className={styles.statBar}>
                <div className={styles.statBarFill} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </BaseCard>
      <BaseCard className={styles.chartCard}>
        <h3>Time Spent Studying</h3>
        <StudyChartCard data={chartData} options={chartOptions} />
      </BaseCard>
      <TopCoursesCard courses={syllabus} progress={progress} />
      <RemindersCard reminders={reminders} />
    </div>
  );
}