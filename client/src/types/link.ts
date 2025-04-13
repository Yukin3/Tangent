export interface Link {
    _id: string;
    sourceNoteId: string;
    targetNoteId: string;
    userId: string;
    type: string;
    createdAt: string;
  }
  
  export interface UseLinksOptions {
    userId?: string;
    noteId?: string;
  }