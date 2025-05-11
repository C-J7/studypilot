import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from "../styles/SyllabusPage.module.css";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SyllabusPage() {
  const [syllabi, setSyllabi] = useState([]);
  const [searchParams, setSearchParams] = useState({ faculty: '', department: '', semester: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUserId(user?.id || "");
      } catch (err) {
        console.error("Error fetching user ID:", err);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (searchParams.faculty || searchParams.department || searchParams.semester) {
      fetchSyllabi();
    }
  }, [searchParams]);

  const fetchSyllabi = async () => {
    try {
      const response = await axios.get('/api/syllabus', { params: searchParams });
      setSyllabi(response.data);
    } catch (err) {
      console.error('Error fetching syllabi:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target);

    try {
      const response = await axios.post('/api/syllabus/upload', formData);
      setSuccess('Syllabus uploaded successfully!');
      fetchSyllabi();
    } catch (err) {
      setError('Error uploading syllabus.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1>Syllabus Management</h1>

      <div className={styles.syllabusContainer}>
        <h2>Search Syllabi</h2>
        <input
          type="text"
          placeholder="Faculty"
          value={searchParams.faculty}
          onChange={(e) => setSearchParams({ ...searchParams, faculty: e.target.value })}
        />
        <input
          type="text"
          placeholder="Department"
          value={searchParams.department}
          onChange={(e) => setSearchParams({ ...searchParams, department: e.target.value })}
        />
        <input
          type="text"
          placeholder="Semester"
          value={searchParams.semester}
          onChange={(e) => setSearchParams({ ...searchParams, semester: e.target.value })}
        />
        <button onClick={fetchSyllabi}>Search</button>
      </div>

      <div className={styles.uploadContainer}>
        <h2>Upload Syllabus</h2>
        <form onSubmit={handleUpload}>
          <input type="file" name="file" required />
          <input type="text" name="title" placeholder="Title" required />
          <input type="text" name="faculty" placeholder="Faculty" required />
          <input type="text" name="department" placeholder="Department" required />
          <input type="text" name="semester" placeholder="Semester" required />
          <input type="hidden" name="userId" value={userId} />
          <button type="submit" disabled={uploading} className={styles.uploadIcon} >Upload</button>
        </form>
        {uploading && <p>Uploading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>

      <div className={styles.syllabusContainer}>
        <h2>Available Syllabi</h2>
        {syllabi.length > 0 ? (
          <ul>
            {syllabi.map((syllabus) => (
              <li key={syllabus.id}>
                {syllabus.title} - {syllabus.faculty} - {syllabus.department} - {syllabus.semester}
                <a href={syllabus.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                <a href={syllabus.fileUrl} download>Download</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No syllabi found.</p>
        )}
      </div>
    </motion.div>
  );
}