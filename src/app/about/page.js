"use client"
import styles from './about.module.css'
import Link from 'next/link'

const teamMembers = [
  { name: "Bamgbose Christian", role: "Team Lead", description: "Full-stack Software Developer and Project Lead" },
  { name: "Blossom ", role: " Project Manager", description: "Specializes in  Project Management, Ensuring productivity and team management." },
  { name: "Goat", role: " UI/UX Designer", description: "Creates intuitive and accessible User interfaces" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsiums" },
  { name: "Lorem Ipsium", role: "Lorem Ipsium", description: "Lorem Ipsium" },
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
        <a className={styles.logo} href="/">
          <img src="/SPlogo.png" alt="StudyPilot Logo" className={styles.logoIcon} />
          StudyPilot
        </a>
        <Link href="/login" className={styles.loginButton}>Login</Link>
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