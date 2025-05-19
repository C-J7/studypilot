'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import api from '@/app/api/services/api'
import { AnimatedRoute } from '@/components/AnimatedRoute'
import styles from './upload.module.css'
import { useAuth } from '@/contexts/AuthContext'

const UploadPage = () => {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return setError('Please select a PDF file')
    if (!user) {
      setError('User not authenticated. Please log in again.');
      setLoading(false);
      return;
    }
    
    setLoading(true)
    setError('')
    setProgress(0)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user.id)
    formData.append('faculty', user.user_metadata?.faculty || 'N/A')
    formData.append('department', user.user_metadata?.department || 'N/A')

    try {
      const response = await api.post('/api/syllabus/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setProgress(percent)
        }
      })
      
      router.push(`/dashboard/planner?syllabus=${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedRoute>
      <div className={styles.container}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={styles.uploadCard}
        >
          <h2>Upload Syllabus</h2>
          
          <motion.form 
            onSubmit={handleUpload}
            className={styles.uploadForm}
          >
            <div className={styles.dropzone}>
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setError(''); 
                  setProgress(0); 
                }}
                className={styles.fileInput}
                aria-label="PDF Upload"
              />
              <label htmlFor="pdf-upload" className={styles.dropLabel}>
                {file ? (
                  <span className={styles.fileName}>{file.name}</span>
                ) : (
                  <>
                    <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
                    <span>Drag & drop or browse files</span>
                    <span className={styles.fileType}>PDF only (max 1MB)</span>
                  </>
                )}
              </label>
            </div>

            {error && <div className={styles.error} role="alert">{error}</div>}

            {loading && (
              <div className={styles.progressBarContainer}>
                <motion.div
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "linear" }}
                />
                <span className={styles.progressText}>{progress}%</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className={styles.uploadButton}
            >
              {loading ? `Uploading...` : 'Generate Study Plan'}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </AnimatedRoute>
  )
}

export default UploadPage