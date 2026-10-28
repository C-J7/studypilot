'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import {
  uploadSyllabus, generateStudyPlan, setSessionCompleted,
  getUserProgressStats, getAuditTrail, errorMessage,
} from '@/app/api/services/api'
import styles from './start.module.css'

const STEPS = ['Add a course', 'Build your plan', 'Stay on track', 'Your insights']
const ease = [0.22, 1, 0.36, 1]

const isoDate = (d) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}
const addDays = (n) => new Date(Date.now() + n * 86400000)
const dayLabel = (iso) => new Date(iso).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
const timeLabel = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

const ACTIONS = {
  SYLLABUS_UPLOADED: 'Syllabus uploaded',
  STUDY_PLAN_GENERATED: 'Study plan generated',
  SESSION_COMPLETED: 'Session completed',
  SESSION_REOPENED: 'Session reopened',
  STUDY_PLAN_DELETED: 'Study plan deleted',
}

const panel = {
  initial: { opacity: 0, x: 40, filter: 'blur(6px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease } },
  exit: { opacity: 0, x: -40, filter: 'blur(6px)', transition: { duration: 0.3 } },
}

const list = { animate: { transition: { staggerChildren: 0.06 } } }
const item = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}

function Choice({ options, value, onChange }) {
  return (
    <div className={styles.choice} role="radiogroup">
      {options.map(([v, label]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v}
          className={value === v ? styles.chosen : ''} onClick={() => onChange(v)}>
          {value === v && <motion.span layoutId={`pill-${options[0][0]}`} className={styles.pill} />}
          <span className={styles.choiceLabel}>{label}</span>
        </button>
      ))}
    </div>
  )
}

function Ring({ value }) {
  const r = 70
  return (
    <svg viewBox="0 0 180 180" className={styles.ring}>
      <circle cx="90" cy="90" r={r} className={styles.ringTrack} />
      <motion.circle
        cx="90" cy="90" r={r} className={styles.ringFill}
        initial={{ pathLength: 0 }} animate={{ pathLength: value / 100 }}
        transition={{ duration: 1.4, ease }}
      />
      <text x="90" y="88" className={styles.ringValue}>{value}%</text>
      <text x="90" y="112" className={styles.ringCaption}>complete</text>
    </svg>
  )
}

function Underhood({ children }) {
  return <p className={styles.underhood}><span>Under the hood</span>{children}</p>
}

export default function Start() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInput = useRef(null)
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const [title, setTitle] = useState('')
  const [syllabus, setSyllabus] = useState(null)
  const [days, setDays] = useState(14)
  const [hours, setHours] = useState(2)
  const [time, setTime] = useState('evening')
  const [plan, setPlan] = useState(null)
  const [done, setDone] = useState({})
  const [insights, setInsights] = useState(null)

  useEffect(() => {
    if (!user) router.replace('/')
  }, [user, router])

  //globals.css makes body the scroller, so reset both on each step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.body.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const run = async (fn) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const sendFile = async (file, courseTitle) => {
    const form = new FormData()
    form.append('file', file)
    form.append('title', courseTitle || title || file.name.replace(/\.pdf$/i, ''))
    form.append('faculty', 'General')
    form.append('department', 'General')
    form.append('semester', String(new Date().getFullYear()))
    form.append('userId', user.id)
    const res = await uploadSyllabus(form)
    setSyllabus(res.data)
  }

  const upload = (file) => run(() => sendFile(file))

  const loadSample = () => run(async () => {
    const blob = await fetch('/sample-syllabus.pdf').then((r) => r.blob())
    const name = 'CSC 307: Operating Systems'
    setTitle(name)
    await sendFile(new File([blob], 'sample-syllabus.pdf', { type: 'application/pdf' }), name)
  })

  const buildPlan = () => run(async () => {
    const res = await generateStudyPlan({
      syllabusId: syllabus.id,
      userId: user.id,
      startDate: isoDate(new Date()),
      endDate: isoDate(addDays(days - 1)),
      hoursPerDay: hours,
      preferredTime: time,
    })
    setPlan(res.data)
  })

  const toggle = (session) => run(async () => {
    const next = !done[session.id]
    await setSessionCompleted(plan.id, session.id, next)
    setDone((d) => ({ ...d, [session.id]: next }))
  })

  const loadInsights = () => run(async () => {
    const [progress, audit] = await Promise.all([getUserProgressStats(user.id), getAuditTrail(user.id)])
    setInsights({ progress: progress.data, events: audit.data.content ?? audit.data })
    setStep(3)
  })

  if (!user) return null

  const sessions = plan?.sessions ?? []
  const completedCount = Object.values(done).filter(Boolean).length

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden />

      <header className={styles.header}>
        <div className={styles.brand}>
          <img src="/SPlogo.png" alt="" />
          <span>StudyPilot</span>
        </div>
        <button type="button" className={styles.skip} onClick={() => router.push('/dashboard')}>
          Skip to dashboard
        </button>
      </header>

      <ol className={styles.stepper}>
        {STEPS.map((label, i) => (
          <li key={label} className={i <= step ? styles.reached : ''}>
            <span className={styles.dot}>
              {i < step ? '✓' : i + 1}
              {i === step && <motion.span layoutId="ring" className={styles.dotRing} />}
            </span>
            <span className={styles.stepLabel}>{label}</span>
          </li>
        ))}
        <motion.span className={styles.rail} initial={{ scaleX: 0 }} animate={{ scaleX: step / (STEPS.length - 1) }} transition={{ duration: 0.6, ease }} />
      </ol>

      <section className={styles.stage}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="upload" className={styles.card} {...panel}>
              <h1>Add your first course</h1>
              <p className={styles.sub}>Upload a syllabus PDF. StudyPilot pulls out every topic so you never plan by hand.</p>

              {!syllabus ? (
                <>
                  <input className={styles.text} placeholder="Course title, e.g. CSC 305: Database Systems"
                    value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
                  <button type="button" className={styles.drop} disabled={busy}
                    onClick={() => fileInput.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) upload(f) }}>
                    <span className={styles.dropIcon}>PDF</span>
                    <strong>{busy ? 'Reading your syllabus...' : 'Drop a syllabus here or click to browse'}</strong>
                    <span>PDF up to 10 MB</span>
                  </button>
                  <input ref={fileInput} type="file" accept="application/pdf" hidden
                    onChange={(e) => e.target.files[0] && upload(e.target.files[0])} />
                  <button type="button" className={styles.link} onClick={loadSample} disabled={busy}>
                    No syllabus to hand? Use a sample Operating Systems course
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.found}>
                    <strong>{syllabus.title}</strong>
                    <span>{syllabus.topics.length} topics found</span>
                  </div>
                  <motion.ul className={styles.topics} variants={list} initial="initial" animate="animate">
                    {syllabus.topics.map((t, i) => (
                      <motion.li key={i} variants={item}><span>{String(i + 1).padStart(2, '0')}</span>{t}</motion.li>
                    ))}
                  </motion.ul>
                  <button type="button" className={styles.primary} onClick={() => setStep(1)}>Continue</button>
                </>
              )}
              <Underhood>Uploads carry an Idempotency-Key, so a retry on a flaky connection never creates a duplicate course. Files are checked for real PDF content and fingerprinted with SHA-256.</Underhood>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="plan" className={styles.card} {...panel}>
              <h1>Build your plan</h1>
              <p className={styles.sub}>Tell StudyPilot how much time you have. It spreads {syllabus.topics.length} topics across your days.</p>

              {!plan ? (
                <>
                  <div className={styles.field}>Finish within
                    <Choice value={days} onChange={setDays} options={[[7, '1 week'], [14, '2 weeks'], [28, '4 weeks']]} />
                  </div>
                  <div className={styles.field}>Hours per day
                    <Choice value={hours} onChange={setHours} options={[[1, '1 hour'], [2, '2 hours'], [3, '3 hours']]} />
                  </div>
                  <div className={styles.field}>Best time to study
                    <Choice value={time} onChange={setTime} options={[['morning', 'Morning'], ['afternoon', 'Afternoon'], ['evening', 'Evening']]} />
                  </div>
                  <button type="button" className={styles.primary} onClick={buildPlan} disabled={busy}>
                    {busy ? 'Scheduling...' : 'Generate my plan'}
                  </button>
                </>
              ) : (
                <>
                  <motion.ul className={styles.timeline} variants={list} initial="initial" animate="animate">
                    {sessions.map((s) => (
                      <motion.li key={s.id} variants={item}>
                        <span className={styles.when}>{dayLabel(s.startTime)}<em>{timeLabel(s.startTime)}</em></span>
                        <span className={styles.what}>{s.topic}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <button type="button" className={styles.primary} onClick={() => setStep(2)}>Looks good</button>
                </>
              )}
              <Underhood>The scheduler is a pure, unit-tested function. Generating twice with the same key returns the original plan instead of a second one.</Underhood>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="track" className={styles.card} {...panel}>
              <h1>Stay on track</h1>
              <p className={styles.sub}>Finished a session? Tick it off. Try a couple now and watch your insights update.</p>
              <motion.ul className={styles.sessions} variants={list} initial="initial" animate="animate">
                {sessions.slice(0, 5).map((s) => (
                  <motion.li key={s.id} variants={item} className={done[s.id] ? styles.ticked : ''}>
                    <button type="button" className={styles.check} onClick={() => toggle(s)} disabled={busy}
                      aria-pressed={!!done[s.id]} aria-label={`Mark ${s.topic} ${done[s.id] ? 'not done' : 'done'}`}>
                      <motion.svg viewBox="0 0 24 24" initial={false} animate={{ opacity: done[s.id] ? 1 : 0, scale: done[s.id] ? 1 : 0.5 }}>
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </motion.svg>
                    </button>
                    <span className={styles.what}>{s.topic}</span>
                    <span className={styles.chip}>{dayLabel(s.startTime)}, {timeLabel(s.startTime)}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <button type="button" className={styles.primary} onClick={loadInsights} disabled={busy}>
                {completedCount ? `See my insights (${completedCount} done)` : 'See my insights'}
              </button>
              <Underhood>Every change is written to an append-only audit trail in the same transaction, and plans carry a version so two devices can never silently overwrite each other.</Underhood>
            </motion.div>
          )}

          {step === 3 && insights && (
            <motion.div key="insights" className={`${styles.card} ${styles.wide}`} {...panel}>
              <h1>Your insights</h1>
              <p className={styles.sub}>This is what your dashboard tracks as the semester goes on.</p>
              <div className={styles.insights}>
                <Ring value={insights.progress.overallProgress} />
                <motion.div className={styles.metrics} variants={list} initial="initial" animate="animate">
                  {[
                    ['Sessions done', `${insights.progress.completedSessions} of ${insights.progress.totalSessions}`],
                    ['Current streak', `${insights.progress.currentStreak} day${insights.progress.currentStreak === 1 ? '' : 's'}`],
                    ['Hours this week', `${insights.progress.hoursThisWeek} h`],
                  ].map(([k, v]) => (
                    <motion.div key={k} variants={item} className={styles.metric}><span>{k}</span><strong>{v}</strong></motion.div>
                  ))}
                </motion.div>
              </div>
              <h2 className={styles.logTitle}>Activity log</h2>
              <motion.ul className={styles.log} variants={list} initial="initial" animate="animate">
                {insights.events.map((e) => (
                  <motion.li key={e.id} variants={item}>
                    <span className={styles.logDot} />
                    <span className={styles.what}>{ACTIONS[e.action] ?? e.action}</span>
                    <span className={styles.logMeta}>{timeLabel(e.occurredAt)}{e.requestId && <code>{e.requestId.slice(0, 8)}</code>}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <button type="button" className={styles.primary} onClick={() => router.push('/dashboard')}>Open my dashboard</button>
              <Underhood>Each entry carries the request id that produced it, the same id returned in the X-Request-Id header and in every error body.</Underhood>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p className={styles.error} role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}
