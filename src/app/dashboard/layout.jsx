'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, UploadFile, CalendarToday, BarChart, Logout } from '@mui/icons-material'
import { useAuth } from '@/contexts/AuthContext'
import styles from './dashboard.module.css'

export default function DashboardLayout({ children }) {
  const { user, signOut, loading } = useAuth() 
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut() // Use signOut from AuthContext
      router.push('/login') 
    } catch (error) {
      console.error('Logout error:', error)
      
    }
  }

  if (loading || !user) { 
    return (
      <div className={styles.pageLoader}> 
        Loading StudyPilot...
      </div>
    );
  }

  // Extract user display name parts
  const fullName = user?.user_metadata?.full_name;
  const userEmail = user?.email;
  let displayInitial = 'U';
  let displayName = 'User';
  let displayDepartment = user?.user_metadata?.department || 'N/A';

  if (fullName) {
    displayName = fullName;
    displayInitial = fullName[0].toUpperCase();
  } else if (userEmail) {
    displayName = userEmail;
    displayInitial = userEmail[0].toUpperCase();
  }

  return (
    <div className={styles.parentctn}>
      <div className={styles.sidebar}>
        <div className={styles.logoctn}>
        <h2 className={styles.logo}>StudyPilot</h2> {/* Added class for logo styling */}
        </div>

        {/* Profile Section */}
        <div className={styles.profile}>
          <div className={styles.profileimgctn}>
            {displayInitial}
          </div>
          <div className={styles.userinfo}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.userDepartment}>{displayDepartment}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <a href="/dashboard" className={`${styles.navitem} ${router.pathname === '/dashboard' ? styles.active : ''}`}>
            <Home className={styles.icon} />
            <span>Dashboard</span>
          </a>
          <a href="/dashboard/upload" className={`${styles.navitem} ${router.pathname === '/dashboard/upload' ? styles.active : ''}`}>
            <UploadFile className={styles.icon} />
            <span>Upload Syllabus</span>
          </a>
          <a href="/dashboard/study-planner" className={`${styles.navitem} ${router.pathname === '/dashboard/study-planner' ? styles.active : ''}`}>
            <CalendarToday className={styles.icon} />
            <span>Study Planner</span>
          </a>
          <a href="/dashboard/progress" className={`${styles.navitem} ${router.pathname === '/dashboard/progress' ? styles.active : ''}`}>
            <BarChart className={styles.icon} />
            <span>Progress</span>
          </a>
          <div className={`${styles.navitem} ${styles.logoutctn}`} onClick={handleLogout}> {/* Applied navitem style for consistency */}
            <Logout className={styles.icon} />
            <span>Logout</span>
          </div>
        </nav>
      </div>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}