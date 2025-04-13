import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  preview?: 'live' | 'edit' | 'preview';
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  value, 
  onChange,
  preview = 'live'
}) => {
  return (
    <div className="h-full w-full" data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={onChange}
        preview={preview}
        height="100%"
        visibleDragbar={false}
        hideToolbar={false}
        extraCommands={[]}
        className="border-none rounded-none"
      />
    </div>
  );
};

export default MarkdownEditor; 