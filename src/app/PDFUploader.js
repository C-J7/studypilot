import { useState, useEffect } from 'react';
import styles from './pdfuploader.module.css';

export default function PDFUploader() {
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  // Load stored PDFs on mount
  useEffect(() => {
    const storedPdfs = localStorage.getItem('studyPilotPdfs');
    if (storedPdfs) setPdfs(JSON.parse(storedPdfs));
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const newPdf = await response.json();
      const updatedPdfs = [...pdfs, newPdf];
      setPdfs(updatedPdfs);
      localStorage.setItem('studyPilotPdfs', JSON.stringify(updatedPdfs));
      setError('');
    } catch (err) {
      setError('Error uploading PDF');
    }
    setIsLoading(false);
  };

  const deletePdf = (pdfId) => {
    const filteredPdfs = pdfs.filter(pdf => pdf.id !== pdfId);
    setPdfs(filteredPdfs);
    localStorage.setItem('studyPilotPdfs', JSON.stringify(filteredPdfs));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Syllabus Upload</h2>
      
      <label className={styles.uploadButton}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileUpload}
          disabled={isLoading}
        />
        {isLoading ? 'Processing...' : 'Upload PDF'}
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.pdfList}>
        {pdfs.map(pdf => (
          <div key={pdf.id} className={styles.pdfCard}>
            <div className={styles.pdfInfo}>
              <h3>{pdf.name}</h3>
              <p>{pdf.size} • {pdf.pages} pages</p>
              <time>{new Date(pdf.uploadedAt).toLocaleDateString()}</time>
            </div>
            <button 
              onClick={() => deletePdf(pdf.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}