"use client"

import './globals.css'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span>StudyPilot</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="#features">Features</Link>
          <Link href="/about">About</Link>
          <Link href="/login" className={styles.loginButton}>Login</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Transform Your Study Experience</h1>
            <p>Let StudyPilot help you organize and optimize your academic journey</p>
          </div>
        </section>

        <section className={styles.features} id="features">
          <h2>Key Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3>Smart Organization</h3>
              <p>Automatically organize your course materials and deadlines</p>
            </div>
            <div className={styles.featureCard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>Progress Tracking</h3>
              <p>Never miss an assignment with smart reminders</p>
            </div>
            <div className={styles.featureCard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3>Progress Tracking</h3>
              <p>Visual insights into your academic progress</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span>StudyPilot</span>
            <p>Transform your study experience</p>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <h4>Product</h4>
              <Link href="/#features">Features</Link>
              <Link href="/about">About</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
