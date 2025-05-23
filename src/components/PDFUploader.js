'use client'

import { useState, useCallback } from 'react'
import styles from '../styles/PDFUploader.module.css'

export default function PDFUploader({ onFileSelect }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      await uploadFile(file)
    }
  }, [])

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (onFileSelect) onFileSelect(file)
      await uploadFile(file)
    }
  }

  const uploadFile = async (file) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadedFile(data)
      setUploadProgress(100)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className={styles.fileInput}
          disabled={uploading}
        />
        
        <div className={styles.uploadContent}>
          {uploading ? (
            <div className={styles.uploadProgress}>
              <div 
                className={styles.progressBar}
                style={{ width: `${uploadProgress}%` }}
              />
              <p>Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <>
              <svg 
                className={styles.uploadIcon} 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p>Drag and drop your PDF here or click to browse</p>
            </>
          )}
        </div>
      </div>

      {uploadedFile && (
        <div className={styles.uploadedFile}>
          <p>✅ Uploaded: {uploadedFile.name}</p>
        </div>
      )}
    </div>
  )
} 