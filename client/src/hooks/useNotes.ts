import { useState, useEffect } from 'react';
import { Note, NotesResponse } from '@/types/note';

export function useNotes(userId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"


  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoading(true);
        const queryParams = userId ? `?userId=${userId}` : '';
        const response = await fetch(`${API_URL}/api/notes${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        
        const data: NotesResponse = await response.json();
        
        if (data.success) {
          setNotes(data.data);
        } else {
          throw new Error(data.data.toString());
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
        setLoading(false);
      }
    }

    fetchNotes();
  }, [userId, API_URL]);

  return { notes, loading, error };
} 