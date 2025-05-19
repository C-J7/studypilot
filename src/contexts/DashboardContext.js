import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const DashboardContext = createContext({});

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    progress: null,
    planner: null,
    syllabus: null,
    reminders: null,
  });

  const fetchAllDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      //Fetch all dashboard data asynchronously to avoid refreshing the page
      const [progressRes, plannerRes, syllabusRes, remindersRes] = await Promise.all([
        supabase.from('progress').select('*').eq('user_id', user.id),
        supabase.from('study_plans').select('*').eq('user_id', user.id),
        supabase.from('syllabus').select('*').eq('user_id', user.id),
        supabase.from('reminders').select('*').eq('user_id', user.id),
      ]);
      setDashboardData({
        progress: progressRes.data || [],
        planner: plannerRes.data || [],
        syllabus: syllabusRes.data || [],
        reminders: remindersRes.data || [],
      });
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchAllDashboardData();
  }, [user, fetchAllDashboardData]);

  return (
    <DashboardContext.Provider value={{ ...dashboardData, loading, error, refetch: fetchAllDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
