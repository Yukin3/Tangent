import { useEffect, useState } from 'react'
import { Folder } from '@/types/folder' // Make sure this type is defined

export function useFolders(userId?: string) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"


  useEffect(() => {
    async function fetchFolders() {
      try {
        setLoading(true)

        const queryParams = userId ? `?userId=${userId}` : ''
        const res = await fetch(`${API_URL || 'http://localhost:8080'}/api/folders${queryParams}`)

        if (!res.ok) throw new Error('Failed to fetch folders')

        const data = await res.json()

        if (data.success) {
          setFolders(data.data)
        } else {
          throw new Error(data.message || 'Unknown error while fetching folders')
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
            if (
              err instanceof TypeError &&
              err.message.includes('Failed to fetch')
            ) {
              setError('server-down');
            } else {
              setError(err.message || 'An unknown error occurred');
            }
          } else {
            setError('An unknown error occurred');
          }
      } finally {
        setLoading(false)
      }
    }

    fetchFolders()
  }, [userId, API_URL])

  return { folders, loading, error }
}
