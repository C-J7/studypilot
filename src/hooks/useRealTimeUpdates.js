
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export const useRealTimeUpdates = (table, callback) => {
  useEffect(() => {
    const subscription = supabase
      .channel('public')
      .on('postgres_changes',
        { event: '*', schema: 'public', table },
        payload => callback(payload)
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, callback])
}