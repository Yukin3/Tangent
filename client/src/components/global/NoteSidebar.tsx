import React from 'react';
import { IconFolderFilled, IconFile, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ResizablePanel } from '@/components/ui/resizable';
import { Note } from '@/types/note';
import { useFolders } from '@/hooks/useFolders';
import type { Folder } from '@/types/folder';


interface FolderProps {
  folder: Folder;
  children?: Folder[];
  onSelectNote: (note: Note) => void;
  allNotes: Note[];
  allFolders: Folder[];
}

const FolderItem: React.FC<FolderProps> = ({folder, onSelectNote, allNotes, allFolders,}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  //Get sub-items of folder
  const childFolders = allFolders.filter(f => f.parent === folder._id);
  const childNotes = allNotes.filter(n => n.folder === folder._id);

  return (
    <div className="mb-1">
      <div
        className="flex items-center p-1.5 hover:bg-secondary/60 rounded cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <IconChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
        ) : (
          <IconChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
        )}
        <IconFolderFilled className="h-4 w-4 mr-2 text-sidebar-primary" />
        <span className="text-sm font-medium">{folder.name}</span>
      </div>

      {isOpen && (
        <div className="ml-5 mt-1 space-y-0.5">
          {/* Notes inside this folder */}
          {childNotes.map(note => (
            <div
              key={note._id}
              className="flex items-center p-1.5 rounded hover:bg-secondary/60 cursor-pointer"
              onClick={() => onSelectNote(note)}
            >
              <IconFile className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm truncate">{note.title}</span>
            </div>
          ))}

          {/* Render child folders recursively */}
          {childFolders.map(sub => (
            <FolderItem
              key={sub._id}
              folder={sub}
              onSelectNote={onSelectNote}
              allNotes={allNotes}
              allFolders={allFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface NoteSidebarProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onCollapse?: () => void;
  isCollapsed?: boolean;
}

export const NoteSidebar: React.FC<NoteSidebarProps> = ({
  notes,
  onSelectNote,
  onCollapse,
  isCollapsed = false,
}) => {
  const { folders, loading, error } = useFolders("67fac1a01a17138d8e741589"); 
  


  // Group notes by folder
  const folderTree: Record<string, Folder[]> = React.useMemo(() => {
    if (loading || error) return {};
  
    // Map folders by parent
    const map: Record<string, Folder[]> = {};
    folders.forEach(folder => {
      const parentId = folder.parent || 'root';
      if (!map[parentId]) map[parentId] = [];
      map[parentId].push(folder);
    });
  
    return map;
  }, [folders, loading, error]);

  const orphanNotes = notes
  .filter(n => !n.folder)
  .sort((a, b) => a.title.localeCompare(b.title)); // optional: alphabetical

  
  
  return (
    <ResizablePanel 
      className="h-full border-r border-border dark:border-sidebar-border bg-sidebar"
      defaultWidth={280}
      minWidth={220}
      maxWidth={400}
      defaultCollapsed={isCollapsed}
    >
      <div className="flex flex-col h-full text-sidebar-foreground">
        <div className="p-3 border-b border-border dark:border-sidebar-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Folders</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={onCollapse}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-3">
        {orphanNotes.map(note => (
          <div
          key={note._id}
          className="flex items-center p-1.5 rounded hover:bg-secondary/60 cursor-pointer"
          onClick={() => onSelectNote(note)}
          >
        <IconFile className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm truncate">{note.title}</span>
        </div>
          ))}
        {folderTree['root']?.map(folder => (
          <FolderItem
            key={folder._id}
            folder={folder}
            onSelectNote={onSelectNote}
            allNotes={notes}
            allFolders={folders}
          />
        ))}
        </div>
      </div>
    </ResizablePanel>
  );
}; 