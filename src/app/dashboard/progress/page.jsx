'use client'

import { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'



import { motion } from 'framer-motion'
import { getUserProgressStats } from '@/app/api/services/api'
import SkeletonLoader from '@/components/SkeletonLoader'
import styles from './progress.module.css'
import { useAuth } from '@/contexts/AuthContext' 

//To use the module we need to register the components we are using
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)


const defaultProgressData = {
  dailyProgress: [],
  streakProgress: [],
  currentStreak: 0,
  longestStreak: 0,
};

const ProgressPage = () => { 
  const { user } = useAuth() 
  const [progressData, setProgressData] = useState(defaultProgressData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      if (user && user.id) { 
        setLoading(true); 
        try {
          const response = await getUserProgressStats(user.id)
          setProgressData(response.data || defaultProgressData)
        } catch (error) {
          console.error('Error fetching progress:', error)
          setProgressData(defaultProgressData); 
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false); 
        setProgressData(defaultProgressData); 
      }
    }

    fetchProgress()
  }, [user])

  const chartData = {
    labels: progressData?.dailyProgress?.map(day => day.label) || [],
    datasets: [{
      label: 'Study Hours',
      data: progressData?.dailyProgress?.map(day => day.hours) || [],
      backgroundColor: '#1e3a8a',
      borderRadius: 4
    }]
  }

  const streakData = {
    labels: progressData?.streakProgress?.map(week => `Week ${week.week}`) || [],
    datasets: [{
      label: 'Study Streak',
      data: progressData?.streakProgress?.map(week => week.days) || [], 
      borderColor: '#1e3a8a',
      tension: 0.4
    }]
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.container}
      >
        <h2>Progress Analytics</h2>
        <SkeletonLoader type="card" count={2} />
      </motion.div>
    );
  }


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      <h2>Progress Analytics</h2>
      
      {loading ? (
        <SkeletonLoader type="card" count={2} />
      ) : (
        <>
          <div className={styles.chartCard}>
            <h3>Daily Study Hours</h3>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>

          <div className={styles.chartCard}>
            <h3>Study Streak</h3>
            <Line data={streakData} options={{ responsive: true }} />
          </div>

          <div className={styles.statsGrid}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={styles.statCard}
            >
              <h4>Current Streak</h4>
              <p>{progressData.currentStreak} days</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={styles.statCard}
            >
              <h4>Longest Streak</h4>
              <p>{progressData.longestStreak} days</p>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default ProgressPage;
