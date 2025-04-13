import { useState, useEffect } from 'react';
import { IconBulb, IconLayout } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { NoteSidebar } from '@/components/global/NoteSidebar';
import MarkdownRenderer from '@/components/global/MarkdownRenderer';
import MarkdownEditor from '@/components/global/MarkdownEditor';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/note';
import GeneralError from '../pages/general-error';

// Sample markdown for demo
const SAMPLE_MARKDOWN = `# Welcome to Tangent Notes

## Markdown Support
This is a **bold text** and *italic text*.

### Features
- Lists support
- Headings with # syntax
- **Bold** and *italic* formatting
- [Links](https://example.com)

## Code Blocks

\`\`\`javascript
// Example JavaScript code
function hello() {
  console.log("Hello, world!");
  return "Hello";
}
\`\`\`

\`\`\`bash
# Terminal commands
npm install
npm run dev
\`\`\`

### Math support coming soon!

> This is a blockquote example.

---

Enjoy using Tangent Notes!`;

export default function NotesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState(SAMPLE_MARKDOWN);
  const [isEditMode, setIsEditMode] = useState(false);
  const { notes, error } = useNotes();

  useEffect(() => {
    // If notes are loaded and there's no active note, set the first one
    if (notes?.length > 0 && !activeNote) {
      setActiveNote(notes[0]);
      // In a real app, you'd fetch the note content here
      setNoteContent(notes[0].content || SAMPLE_MARKDOWN);
    }
  }, [notes, activeNote]);

  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
    // In a real app, you'd fetch the note content here
    setNoteContent(note.content || SAMPLE_MARKDOWN);
    setIsEditMode(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (error === 'server-down') {
    return <GeneralError />;
  }
  
  if (error) {
    return <GeneralError minimal />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground">
      {/* Top toolbar */}
      <div className="h-12 border-b flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            <IconLayout className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-medium">
            {activeNote?.title || "Tangent Notes"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEditMode}
            className="text-xs"
          >
            {isEditMode ? "Preview" : "Edit"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Toggle theme"
          >
            <IconBulb className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <NoteSidebar
            notes={notes}
            onSelectNote={handleNoteSelect}
            onCollapse={toggleSidebar}
            isCollapsed={sidebarCollapsed}
          />
        )}

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {isEditMode ? (
            <MarkdownEditor 
              value={noteContent} 
              onChange={(value) => setNoteContent(value || '')}
            />
          ) : (
            <MarkdownRenderer content={noteContent} />
          )}
        </div>
      </div>
    </div>
  );
}

