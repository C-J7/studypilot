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
import SkeletonLoader from '@/components/SkeletonLoader'

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
      <SkeletonLoader/>
    )
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
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

