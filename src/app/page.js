"use client"

import './globals.css'
import styles from './page.module.css'
import PDFUploader from '@/components/PDFUploader'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>StudyPilot</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="#features">Features</Link>
          <Link href="/about">About</Link>
          <button className={styles.loginButton}>Login</button>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Transform Your Study Experience</h1>
            <p>Upload your syllabus and let StudyPilot organize your academic journey</p>
            <div className={styles.uploadSection}>
              <PDFUploader />
            </div>
          </div>
          <div className={styles.heroGraphic}>
            <svg className={styles.abstractShape} viewBox="0 0 200 200">
              <path fill="#4F46E5" d="M39,-65.7C46.9,-56.8,47.3,-39.2,51.3,-24.7C55.4,-10.2,63.1,1.1,63.7,13.4C64.3,25.7,57.8,38.9,47.6,47.9C37.4,56.9,23.5,61.7,8.2,65.1C-7.1,68.6,-23.8,70.7,-36.9,64.9C-50,59.1,-59.5,45.4,-65.9,30.5C-72.3,15.6,-75.5,-0.5,-71.2,-14.1C-66.9,-27.7,-55,-38.8,-42.3,-46.9C-29.6,-55,-14.8,-60.1,1.3,-62C17.3,-63.9,31.1,-74.6,39,-65.7Z" transform="translate(100 100)" />
            </svg>
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
              <h3>Deadline Tracking</h3>
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
            </div>
            <div>
              <h4>Company</h4>
              <Link href="/about">About</Link>
            </div>
            <div>
              <h4>Legal</h4>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} StudyPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
