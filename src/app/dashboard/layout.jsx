'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Home, UploadFile, CalendarToday, BarChart, Logout } from '@mui/icons-material'
import { useAuth } from '@/contexts/AuthContext'
import styles from './dashboard.module.css'
import clsx from 'clsx'
import SkeletonLoader from '@/components/SkeletonLoader'

//Lazyloading of dashboard pages for performance
const DashboardHome = lazy(() => import('./page'))
const UploadSyllabusPage = lazy(() => import('./upload-syllabus/page'))
const StudyPlannerPage = lazy(() => import('./study-planner/page'))
const ProgressPage = lazy(() => import('./progress/page'))

//Helper to map route to component
const routeToComponent = (pathname) => {
  if (pathname === '/dashboard') return <DashboardHome />
  if (pathname === '/dashboard/upload-syllabus') return <UploadSyllabusPage />
  if (pathname === '/dashboard/study-planner') return <StudyPlannerPage />
  if (pathname === '/dashboard/progress') return <ProgressPage />
  return <DashboardHome />
}

export default function DashboardLayout({ children }) {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [activePath, setActivePath] = useState('/dashboard')
 

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading || !user) {
    return (
      <div className={styles.pageLoader}>
        <SkeletonLoader type="card" />
        <span style={{marginLeft: 16}}>Loading Dashboard...</span>
      </div>
    )
  }

  const fullName = user?.user_metadata?.full_name
  const userEmail = user?.email
  let displayInitial = 'U'
  let displayName = 'User'
  let displayDepartment = user?.user_metadata?.department || 'N/A'

  if (fullName) {
    displayName = fullName
    displayInitial = fullName[0].toUpperCase()
  } else if (userEmail) {
    displayName = userEmail
    displayInitial = userEmail[0].toUpperCase()
  }

  //Sidebar navigation items
  const navItems = [
    {
      label: 'Home',
      icon: <Home className={styles.icon} />,
      href: '/dashboard'
    },
    {
      label: 'Upload Syllabus',
      icon: <UploadFile className={styles.icon} />,
      href: '/dashboard/upload-syllabus'
    },
    {
      label: 'Study Planner',
      icon: <CalendarToday className={styles.icon} />,
      href: '/dashboard/study-planner'
    },
    {
      label: 'Progress',
      icon: <BarChart className={styles.icon} />,
      href: '/dashboard/progress'
    }
  ]

  //Handle navigation without reload
  const handleNav = (href) => (e) => {
    e.preventDefault()
    if (href !== pathname) {
      router.push(href)
    }
  }

  //Keyboard accessibility for logout
  const handleLogoutKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLogout()
    }
  }

  // Sidebar always visible
  const Sidebar = (
    <aside
      className={styles.sidebar}
      aria-label="Sidebar"
    >
      <div className={styles.logoctn}>
        <img src="/SPlogo.png" alt="Logo" className={styles.logoimg} />
        <h2 className={styles.logo}>StudyPilot</h2>
      </div>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.avatar}>{displayInitial}</div>
        <div className={styles.userMeta}>
          <span className={styles.userName}>{displayName}</span>
          <span className={styles.userDepartment}>{displayDepartment}</span>
        </div>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={clsx(
              styles.navitem,
              activePath === item.href && styles.active
            )}
            onClick={handleNav(item.href)}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
        <div
          className={clsx(styles.navitem, styles.logoutctn)}
          onClick={handleLogout}
          onKeyDown={handleLogoutKey}
          tabIndex={0}
          role="button"
          aria-label="Sign out"
        >
          <Logout className={styles.icon} />
          <span>Sign out</span>
        </div>
      </nav>
    </aside>
  )

  
  return (
    <div className={styles.parentctn}>
      {Sidebar}
      <main className={styles.main}>
        <Suspense fallback={
          <div className={styles.pageLoader}>Loading...</div>
        }>
          {routeToComponent(activePath)}
        </Suspense>
      </main>
    </div>
  )
}