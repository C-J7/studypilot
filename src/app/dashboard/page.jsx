'use client'

import { useState } from 'react'
import { SkeletonLoader } from '@/components/SkeletonLoader'
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
import { useDashboard } from '@/contexts/DashboardContext';
import SearchBar from '@/components/SearchBar';
import BaseCard from '@/components/BaseCard';
import RemindersCard from '@/components/RemindersCard';
import StudyChartCard from '@/components/StudyChartCard';
import TopCoursesCard from '@/components/TopCoursesCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, planner, syllabus, reminders, loading, error, refetch } = useDashboard();
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

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

  //Compute dashboard stats from progress and planner data
  const stats = {
    courses: syllabus ? syllabus.length : 0,
    currentStreak: progress?.[0]?.current_streak || 0,
    longestStreak: progress?.[0]?.longest_streak || 0,
    studyHours: progress?.[0]?.weekly_hours || 0,
    upcomingSessions: planner ? planner.length : 0,
  };

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
  if (error) {
    return <div className="dataMessage">{error}</div>;
  }

  const userNameForWelcomeCard = user?.user_metadata?.full_name || user?.email || 'User';

  //Quick stats
  const quickStats = [
    { label: 'Courses', value: stats.courses },
    { label: 'Current Streak', value: `${stats.currentStreak} days` },
    { label: 'Longest Streak', value: `${stats.longestStreak} days` },
  ];

  return (
    <div className={styles.dashboardGrid}>
      <WelcomeCard userName={userNameForWelcomeCard} progress={progress?.[0]?.overall_progress || 0} />
      <SearchBar onSearch={handleSearch} loading={searchLoading} error={searchError} results={searchResults} />
      
        <>
          <BaseCard className={styles.quickStatsCard}>
            <h3>Quick Stats</h3>
            {quickStats.map(stat => (
              <div key={stat.label} className={styles.statRow}>
                <span>{stat.label}</span>
                <span>{stat.value}</span>
                <div className={styles.statBar}><div className={styles.statBarFill} style={{width: stat.label === 'Courses' ? `${(stats.courses/5)*100}%` : stat.label === 'Current Streak' ? `${(stats.currentStreak/30)*100}%` : `${(stats.longestStreak/30)*100}%`}} /></div>
              </div>
            ))}
          </BaseCard>
          <BaseCard className={styles.chartCard}>
            <h3>Time Spent Studying</h3>
            <StudyChartCard data={chartData} options={chartOptions} />
          </BaseCard>
          <TopCoursesCard courses={syllabus} progress={progress} />
          <RemindersCard reminders={reminders} />
        </>
    </div>
  );
}