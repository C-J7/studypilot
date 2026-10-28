"use client";
import { useState, useEffect } from 'react';
import { uploadSyllabus, errorMessage } from '@/app/api/services/api';
import { useAuth } from '@/contexts/AuthContext';
import facultiesData from '@/utils/faculties_departments.json';
import styles from '@/styles/UploadSyllabus.module.css';
import CustomDropdown from '@/components/CustomDropdown';

export default function UploadSyllabus() {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFaculty(user.faculty || '');
      setDepartment(user.department || '');
    }
  }, [user]);

  useEffect(() => {
    const fac = facultiesData[0].faculties.find(f => f.name === faculty);
    setDepartments(fac ? fac.departments : []);
  }, [faculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('faculty', faculty);
    formData.append('department', department);
    formData.append('semester', semester);
    formData.append('userId', user?.id);
    try {
      const res = await uploadSyllabus(formData);
      setSuccess(`Uploaded "${res.data.title}": ${res.data.topics.length} topics found. Head to Study Planner to schedule it.`);
    } catch (err) {
      setError(errorMessage(err, 'Upload failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        <label>Faculty</label>
        <select value={faculty} onChange={e => setFaculty(e.target.value)} required>
          <option value="">Select faculty</option>
          {facultiesData[0].faculties.map(f => (
            <option key={f.name} value={f.name}>{f.name}</option>
          ))}
        </select>
        <label>Department</label>
        <select value={department} onChange={e => setDepartment(e.target.value)} required>
          <option value="">Select department</option>
          {departments.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
        <label>Semester</label>
        <CustomDropdown
          options={["First", "Second"]}
          value={semester}
          onChange={setSemester}
          placeholder="Select semester"
        />
        <label>PDF File</label>
        <div
          className={`${styles.dropzone} ${file ? styles.hasFile : ''}`}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile && droppedFile.type === 'application/pdf') {
              setFile(droppedFile);
            } else {
              alert('Please select a PDF file.');
            }
          }}
          onClick={() => document.getElementById('pdf-upload-input').click()}
          tabIndex={0}
          role="button"
          style={{ cursor: 'pointer' }}
        >
          <input
            id="pdf-upload-input"
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={e => {
              const selected = e.target.files[0];
              if (selected && selected.type === 'application/pdf') {
                setFile(selected);
              } else {
                alert('Please select a PDF file.');
              }
            }}
            required
          />
          <div className={styles.uploadContent}>
            <svg
              className={styles.uploadIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              width="48"
              height="48"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>
              {file
                ? `Selected: ${file.name}`
                : 'Drop your files here or Browse'}
            </p>
            <span className={styles.supportText}>Supports PDF files only</span>
          </div>
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Syllabus'}
        </button>
        {success && <div className={styles.success}>{success}</div>}
        {error && <div role="alert" style={{ color: '#b91c1c', marginTop: '1rem' }}>{error}</div>}
        <p className={styles.supportText} style={{ marginTop: '1rem' }}>
          No syllabus handy? <a href="/sample-syllabus.pdf" download>Download a sample PDF</a> and upload it.
        </p>
      </form>
    </div>
  );
}
