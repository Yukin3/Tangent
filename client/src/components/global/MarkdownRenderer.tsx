import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { IconCopy, IconCheck } from '@tabler/icons-react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert dark:prose-invert max-w-none p-6 overflow-auto w-full h-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // @ts-expect-error - Workaround for complex typing issues w react-markdown
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            
            const language = match ? match[1] : '';
            
            return (
              <CodeBlock
                language={language}
                value={String(children).replace(/\n$/, '')}
              />
            );
          },
          h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-lg font-bold mt-3 mb-2">{children}</h4>,
          h5: ({ children }) => <h5 className="text-base font-bold mt-3 mb-1">{children}</h5>,
          h6: ({ children }) => <h6 className="text-sm font-bold mt-3 mb-1">{children}</h6>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center text-xs bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded px-2 py-1 transition-colors"
          title="Copy code"
        >
          {!copied ? (
            <>
              <IconCopy className="h-3.5 w-3.5 mr-1" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                {language || 'Copy'}
              </span>
            </>
          ) : (
            <>
              <IconCheck className="h-3.5 w-3.5 mr-1" />
              <span>Copied</span>
            </>
          )}
        </button>
      </div>
      <pre 
        className={`relative p-4 rounded-md bg-black/80 dark:bg-white/10 ${language && `language-${language}`}`}
      >
        <code className={language && `language-${language}`}>{value}</code>
      </pre>
    </div>
  );
};

export default MarkdownRenderer; 