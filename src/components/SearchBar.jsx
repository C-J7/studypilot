import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { searchSyllabi } from '@/app/api/services/api'
import CustomDropdown from '@/components/CustomDropdown';
import facultiesDepartments from '@/utils/faculties_departments.json';
import styles from '@/styles/SearchBar.module.css';

const SearchBar = ({ onSearch, loading, error, results }) => {
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [query, setQuery] = useState('');

  const handleFacultyChange = (value) => {
    setFaculty(value);
    setDepartment('');
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (faculty && department) {
      onSearch(faculty, department, query);
    }
  };

  const facultyOptions = facultiesDepartments.flatMap(u => u.faculties.map(f => f.name));
  const departmentOptions = faculty
    ? facultiesDepartments.flatMap(u => u.faculties.filter(f => f.name === faculty).flatMap(f => f.departments))
    : [];

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <CustomDropdown
        label="Faculty"
        options={facultyOptions}
        value={faculty}
        onChange={handleFacultyChange}
        placeholder="Select Faculty"
      />
      <CustomDropdown
        label="Department"
        options={departmentOptions}
        value={department}
        onChange={handleDepartmentChange}
        placeholder="Select Department"
      />
      <input
        type="text"
        placeholder="Search syllabus..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
      {error && <div className={styles.error}>{error}</div>}
      {results && results.length > 0 && (
        <div className={styles.results}>
          {results.map(r => (
            <div key={r.id} className={styles.resultItem}>{r.title}</div>
          ))}
        </div>
      )}
    </form>
  );
}

export default SearchBar