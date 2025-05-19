import { useEffect, useState } from 'react'
import api from '@/app/api/services/api'

export default function BackendTest() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/api/test')
      .then(res => setMessage(res.data))
      .catch(() => setMessage('Backend not reachable'))
  }, [])

  return <div>Backend Test: {message}</div>
}