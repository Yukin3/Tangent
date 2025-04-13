export interface Note {
  _id: string;
  title: string;
  content: string;
  tags?: string[];
  folder?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface NotesResponse {
  success: boolean;
  data: Note[];
} 