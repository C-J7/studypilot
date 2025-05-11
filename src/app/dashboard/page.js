"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './dashboard.module.css'
import StudyPlanPage from '@/components/StudyPlanPage'
import WelcomeCard from '@/components/WelcomeCard';
import TopCoursesCard from '@/components/TopCoursesCard';
import StudyChartCard from '@/components/StudyChartCard';
import RemindersCard from '@/components/RemindersCard';
import StatsCard from '@/components/StatsCard';
import SyllabusPage from '@/components/SyllabusPage'
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syllabusId, setSyllabusId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const router = useRouter();
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          fetchDashboardData(user.id);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    const fetchDashboardData = async (userId) => {
      try {
        const response = await axios.get(`/api/dashboard?userId=${userId}`);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading...
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>StudyPilot</span>
        </Link>
        <div className={styles.navLinks}>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.dashboardGrid}>
          <WelcomeCard userName={user?.user_metadata?.name || 'User'} progress={dashboardData?.progress || 50} />
          <TopCoursesCard courses={dashboardData?.courses || []} />
          <StudyChartCard data={dashboardData?.studyChart || []} />
          <SyllabusPage />
          <StudyPlanPage userId={user?.id} syllabusId={syllabusId} />
          <RemindersCard reminders={dashboardData?.reminders || []} />
          <StatsCard stats={dashboardData?.stats || {}} />
        </div>
      </main>
    </div>
  );
}