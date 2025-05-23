"use client";
import { useState, useEffect } from 'react';
import { uploadSyllabus } from '@/app/api/services/api';
import facultiesData from '@/utils/faculties_departments.json';
import styles from '@/styles/UploadSyllabus.module.css';
import CustomDropdown from '@/components/CustomDropdown';

export default function UploadSyllabus({ user }) {
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('faculty', faculty);
    formData.append('department', department);
    formData.append('semester', semester);
    formData.append('userId', user?.id);
    try {
      await uploadSyllabus(formData);
      setSuccess(true);
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
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} required />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Syllabus'}
        </button>
        {success && <div className={styles.success}>Upload successful!</div>}
      </form>
    </div>
  );
}
