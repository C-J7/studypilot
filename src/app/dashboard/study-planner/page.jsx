'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import api, { completeSession } from '@/app/api/services/api'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import styles from './planner.module.css'
import { useAuth } from '@/contexts/AuthContext' 

const PlannerPage = () => { 
  const { user } = useAuth() 
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    const fetchPlans = async () => {
      if (user && user.id) { 
        setLoading(true);
        try {
          const response = await api.get(`/api/study-plan/user/${user.id}`)
          const formattedEvents = response.data.map(plan => ({
            id: plan.id,
            title: plan.course,
            start: plan.startDate,
            end: plan.endDate,
            extendedProps: { ...plan }
          }))
          setEvents(formattedEvents)
        } catch (error) {
          console.error('Error fetching study plan:', error)
          setEvents([]); 
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false);
      }
    }

    fetchPlans()
  }, [user]) 

  const handleDownload = async (planId) => {
    try {
      const response = await api.get(`/api/study-plan/${planId}/export`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `study-plan-${planId}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleCompleteSession = async (studyPlanId, sessionId) => {
    try {
      await completeSession(studyPlanId, sessionId)
      //Optionally refetch events or update UI
    } catch (error) {
      console.error('Failed to mark session complete:', error)
    }
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : (
        <>
          <div className={styles.calendarContainer}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={(info) => setSelectedPlan(info.event.extendedProps)}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
            />
          </div>

          <AnimatePresence>
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={styles.planDetails}
              >
                <h3>{selectedPlan.course} Study Plan</h3>
                <div className={styles.detailItem}>
                  <span>Start Date:</span>
                  {new Date(selectedPlan.startDate).toLocaleDateString()}
                </div>
                <div className={styles.detailItem}>
                  <span>End Date:</span>
                  {new Date(selectedPlan.endDate).toLocaleDateString()}
                </div>
                <button 
                  onClick={() => handleDownload(selectedPlan.id)}
                  className={styles.downloadButton}
                >
                  Download Plan
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className={styles.closeButton}
                >
                  Close
                </button>
                <button
                  onClick={() => handleCompleteSession(selectedPlan.id, selectedPlan.sessionId)}
                  className={styles.completeButton}
                >
                  Mark Session Complete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

export default PlannerPage;