"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.css'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '@/contexts/AuthContext'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const router = useRouter()
  const { startDemo } = useAuth()
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  //Remember Me: persist session in localStorage
  useEffect(() => {
    if (rememberMe && email) {
      localStorage.setItem('rememberedEmail', email)
    }
  }, [rememberMe, email])

  useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail')
    if (remembered) setEmail(remembered)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg('Signing in...')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      })

      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Incorrect email or password. Please try again.' : error.message)
        setSuccessMsg('')
        return
      }

      if (data?.user) {
        setSuccessMsg('Login successful! Loading Dashboard...')
        setTimeout(() => router.push('/dashboard'), 1200)
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.')
      setSuccessMsg('')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotLoading(true)
    setInfoMsg('')
    setForgotSent(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail)
      if (error) throw error
      setForgotSent(true)
      setInfoMsg('Password reset email sent! Check your inbox.')
    } catch (err) {
      setInfoMsg('Failed to send reset email.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <a className={styles.logo} href="/">
          <img src="/SPlogo.png" alt="StudyPilot Logo" className={styles.logoIcon} />
          StudyPilot
        </a>
      </nav>
      <main className={styles.main}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <h1>Sign In</h1>
            <p className={styles.subtitle}>Welcome back! Please login to your account.</p>
            {error && <div className={styles.error}>{error}</div>}
            {successMsg && <div className={styles.success}>{successMsg}</div>}
            {infoMsg && <div className={styles.info}>{infoMsg}</div>}
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
              <div className={styles.inputGroup}>
                <label>Password</label>
                <div className={styles.passwordInput}>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className={styles.visibilityToggle} onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>
              <div className={styles.options}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /> Remember me
                </label>
                <button type="button" className={styles.forgotPassword} onClick={() => setInfoMsg('forgot')}>Forgot password?</button>
              </div>
              <button className={styles.submitButton} type="submit" disabled={loading}>{loading ? (successMsg === 'Signing in...' ? 'Signing in...' : 'Loading Dashboard...') : 'Sign In'}</button>
            </form>
            {infoMsg === 'forgot' && (
              <form className={styles.form} onSubmit={handleForgotPassword} style={{marginTop: 16}}>
                <div className={styles.inputGroup}>
                  <label>Enter your email to reset password</label>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                <button className={styles.submitButton} type="submit" disabled={forgotLoading}>{forgotLoading ? 'Sending...' : 'Send Reset Email'}</button>
                {forgotSent && <div className={styles.success}>Check your email for reset instructions.</div>}
              </form>
            )}
            <div className={styles.divider}><span>or</span></div>
            <button
              type="button"
              className={styles.submitButton}
              style={{ background: 'transparent', color: 'inherit', border: '1px solid currentColor' }}
              onClick={() => { startDemo(); router.push('/dashboard') }}
            >
              Explore the demo
            </button>
            <div className={styles.signupPrompt}>
              Don't have an account? <a className={styles.signupLink} href="/signup">Sign up</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}