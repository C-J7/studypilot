"use client"

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './signup.module.css'
import CustomDropdown from '@/components/CustomDropdown';
import facultiesDepartments from '@/utils/faculties_departments.json';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    faculty: '',
    department: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Extract faculty and department options
  const facultyOptions = facultiesDepartments.flatMap(u => u.faculties.map(f => f.name));
  const departmentOptions = formData.faculty
    ? facultiesDepartments.flatMap(u => u.faculties.filter(f => f.name === formData.faculty).flatMap(f => f.departments))
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    //Validate Password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      //Create User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            faculty: formData.faculty,
            department: formData.department
          }
        }
      })

      if (authError) throw authError

      if (authData?.user) {
        //Create user profile in supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              email: formData.email,
              department: formData.department,
              faculty: formData.faculty
            }
          ])

        if (profileError) throw profileError

        setSuccess(true)
        //Wait for 2 seconds to show success message before redirecting
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <span>StudyPilot</span>
        </Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <h1>Create Account</h1>
            <p className={styles.subtitle}>Join StudyPilot to transform your academic journey</p>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            {success && (
              <div className={styles.success}>
                Account created successfully! Back to login Page...
              </div>
            )}

            <form onSubmit={handleSignup} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="faculty">Faculty</label>
                <CustomDropdown
                  label="Faculty"
                  options={facultyOptions}
                  value={formData.faculty}
                  onChange={val => setFormData(prev => ({ ...prev, faculty: val, department: '' }))}
                  placeholder="Select Faculty"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="department">Department</label>
                <CustomDropdown
                  label="Department"
                  options={departmentOptions}
                  value={formData.department}
                  onChange={val => setFormData(prev => ({ ...prev, department: val }))}
                  placeholder="Select Department"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Password</label>
                <div className={styles.passwordInput}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.visibilityToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Confirm Password</label>
                <div className={styles.passwordInput}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.visibilityToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className={styles.loginPrompt}>
              Already have an account?{' '}
              <Link href="/login" className={styles.loginLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}