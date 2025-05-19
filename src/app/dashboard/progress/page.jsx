'use client'
import { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import api from '@/app/api/services/api'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import styles from './progress.module.css'
import { useAuth } from '@/contexts/AuthContext' 

const ProgressPage = () => { 
  const { user } = useAuth() 
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      if (user && user.id) { 
        setLoading(true); 
        try {
          const response = await api.get(`/api/progress/user/${user.id}`)
          setProgressData(response.data)
        } catch (error) {
          console.error('Error fetching progress:', error)
          setProgressData(null); 
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false); 
        setProgressData(null); 
      }
    }

    fetchProgress()
  }, [user])

  //In the event progress data is null
  const chartData = {
    labels: progressData?.dailyProgress?.map(day => day.date) || [],
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
      data: progressData?.streakProgress?.map(week => week.days) || [], // Corrected: week.days instead of streak.days
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

  if (!progressData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.container}
      >
        <h2>Progress Analytics</h2>
        <p>Could not load progress data. Please try again later.</p>
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