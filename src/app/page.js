'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { API_URL } from '@/app/api/services/api'
import styles from './home.module.css'

const steps = [
  ['Upload', 'Drop in a course syllabus. Topics are extracted in seconds.'],
  ['Plan', 'Get a day-by-day schedule that fits the hours you have.'],
  ['Track', 'Tick sessions off and watch streaks and progress build.'],
]

const rise = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Home() {
  const { user, start } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')

  //Wake the free-tier API while the visitor reads the page
  useEffect(() => {
    fetch(`${API_URL}/actuator/health`).catch(() => {})
  }, [])

  const begin = (e) => {
    e.preventDefault()
    start(name)
    router.push('/start')
  }

  return (
    <main className={styles.page}>
      <div className={styles.glowA} aria-hidden />
      <div className={styles.glowB} aria-hidden />

      <header className={styles.header}>
        <motion.div className={styles.brand} {...rise(0)}>
          <img src="/SPlogo.png" alt="" />
          <span>StudyPilot</span>
        </motion.div>
        {user && (
          <motion.button type="button" className={styles.ghost} onClick={() => router.push('/dashboard')} {...rise(0)}>
            Open my workspace
          </motion.button>
        )}
      </header>

      <section className={styles.hero}>
        <motion.p className={styles.eyebrow} {...rise(0.1)}>Study planning, done for you</motion.p>
        <motion.h1 {...rise(0.2)}>
          Turn any syllabus into a plan you will actually follow.
        </motion.h1>
        <motion.p className={styles.lede} {...rise(0.3)}>
          StudyPilot reads your course outline, schedules every topic around your week,
          and keeps you on track with streaks and progress you can see.
        </motion.p>

        <motion.form className={styles.form} onSubmit={begin} {...rise(0.4)}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name (optional)"
            aria-label="Your first name"
            maxLength={40}
          />
          <button type="submit">Start studying</button>
        </motion.form>
        <motion.p className={styles.note} {...rise(0.5)}>No sign-up. Your workspace is private to this browser.</motion.p>
      </section>

      <section className={styles.steps}>
        {steps.map(([title, body], i) => (
          <motion.div key={title} className={styles.step} {...rise(0.6 + i * 0.1)}>
            <span className={styles.stepNo}>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </motion.div>
        ))}
      </section>
    </main>
  )
}
