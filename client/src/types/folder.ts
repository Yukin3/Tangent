export interface Folder {
    _id: string
    userId: string
    name: string
    parent: string | null
    noteIds: string[]
    path: string[]
    isStarred: boolean
    createdAt: string
    updatedAt: string
  }
  