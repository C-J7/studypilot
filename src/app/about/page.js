"use client"

import styles from './about.module.css'
import Link from 'next/link'

const teamMembers = [
  { name: "Bamgbose Christian", role: "Team Lead", description: "Certified Full-stack developer with experience in Software Development" },
  { name: "Blossom ", role: "Frontend Developer || Project Manager", description: "Specializes in Frontend development and Project Management." },
  { name: "Goat", role: " UI/UX Designer", description: "Creates intuitive and accessible user interfaces" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Focuses on implementing AI-driven study recommendations. Wahala pro max:)" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsiums" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" }
]

export default function About() {
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
          <Link href="/#features">Features</Link>
          <Link href="/about">About</Link>
          <button className={styles.loginButton}>Login</button>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.aboutHero}>
          <h1>Our Team</h1>
          <p>Meet the talented individuals behind StudyPilot</p>
        </section>

        <section className={styles.team}>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.avatar}>
                  {member.name.charAt(0)}
                </div>
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.description}</p>
              </div>
            ))}
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
  )
} 