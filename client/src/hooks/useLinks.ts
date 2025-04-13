import { Link, UseLinksOptions } from '@/types/link';
import { useEffect, useState } from 'react';

export function useLinks({ userId, noteId }: UseLinksOptions) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    //Get a link
    const fetchLinks = async () => {
      try {
        setLoading(true);
        let url = "";

        if (noteId) {
          url = `${API_URL}/api/links/note?noteId=${noteId}`;
        } else if (userId) {
          url = `${API_URL}/api/links?userId=${userId}`;
        } else {
          setError("No userId or noteId provided");
          setLoading(false);
          return;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch links");

        const data = await response.json();

        type RawLink = {
          _id: string;
          sourceNoteId: string;
          targetNoteId: string;
          userId: string;
          type: string;
          createdAt: string;
        };

        if (data.success && Array.isArray(data.data)) {
          const parsedLinks: Link[] = (data.data as RawLink[]).map((link) => ({
            _id: String(link._id),
            sourceNoteId: String(link.sourceNoteId),
            targetNoteId: String(link.targetNoteId),
            userId: String(link.userId),
            type: String(link.type),
            createdAt: String(link.createdAt),
          }));

          setLinks(parsedLinks);
        } else {
          throw new Error(data.message || "Failed to load links");
        }
      } catch (err: unknown) {
        if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
          setError('server-down');
        } else if (err instanceof Error) {
          setError(err.message || 'An unknown error occurred');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [userId, noteId, API_URL]);

  //Delete link + update state
  const deleteLink = async (sourceNoteId: string, targetNoteId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/links`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, sourceNoteId, targetNoteId })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete link');
      }

      // Optimistically update local state
      setLinks((prev) =>
        prev.filter(link =>
          !(
            link.sourceNoteId === sourceNoteId &&
            link.targetNoteId === targetNoteId
          )
        )
      );

      return { success: true };
    } catch (err) {
      console.error('❌ Failed to delete link:', err);
      return { success: false, message: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  return { links, loading, error, deleteLink };
}
