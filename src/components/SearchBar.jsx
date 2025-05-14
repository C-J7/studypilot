// src/components/SearchBar.jsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/services/api'

const SearchBar = ({ user, onSearch }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const search = async () => {
      if (query.length < 3) return
      
      setLoading(true)
      try {
        const response = await api.get('/api/syllabus', {
          params: {
            faculty: user.faculty,
            department: user.department,
            search: query
          }
        })
        setResults(response.data)
        onSearch(response.data)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(() => search(), 300)
    return () => clearTimeout(debounce)
  }, [query, user, onSearch])

  return (
    <motion.div layout className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search syllabi..."
        className="search-input"
      />
      {loading && <div className="loading-spinner" />}
    </motion.div>
  )
}