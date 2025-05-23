"use client"
import styles from './about.module.css'
import Link from 'next/link'

const teamMembers = [
  { name: "BAMGBOSE CHRISTIAN JESUJUNI", role: "Team Lead", description: "Full-stack Software Developer and Project Lead" },
  { name: "OGBONNA BLOSSOM NNEOMA", role: " Project Manager", description: "Specializes in  Project Management, Ensuring productivity and team management." },
  { name: "OKPALAEKE CHUKWUDUBEM DECLAN IKEM", role: " UI/UX Designer", description: "Creates intuitive and accessible User interfaces" },
  { name: "OLUKAYODE PEACE DARASIMI", role: "Authentication & Database Setup (PostgreSQL)", description: "Implemented Supabase Authentification and Setup the PostgreSql Services" },
  { name: "AKINSOHUN OLUWANIFEMI SUSANNA", role: "QA Tester", description: "Ensured the Web Services rendered met modern Standards through continuous testing." },
  { name: "OLOYEDE ABDULMOTIN FOLUSO", role: "Project Researcher", description: "Conducted Project research to validate the need for the tool." },
  { name: "IBEAKANMA CHIMEREZE JESSE", role: "Frontend Developer", description: "Developed the Landing" },
  { name: "OLUWASEMILORE TOLUWANIMI", role: " UI/UX Designer", description: "Creates intuitive and accessible User interfaces" },
  { name: "ALADEITAN TONILOBA DAVID", role: "User Analytics", description: "Conducted Surveys and facilitated User testing." },
  { name: "ADEYEMI ISRAEL ADETOLA", role: "User Analytics", description: "Conducted Surveys and facilitated User testing." }

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