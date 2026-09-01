import React, { useState, useRef, useEffect } from 'react';

interface PromptViewerProps {
  prompt: string;
  maxLines?: number;
}

export function PromptViewer({ prompt, maxLines = 5 }: PromptViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const lineHeight = 1.6;

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    const computedStyle = window.getComputedStyle(element);
    const lh = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * lineHeight;
    const maxHeight = lh * maxLines;
    const scrollHeight = element.scrollHeight;

    setShouldTruncate(scrollHeight > maxHeight + 2);
  }, [prompt, maxLines]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const containerStyle: React.CSSProperties = {
    maxHeight: isExpanded ? 'none' : undefined,
    overflow: isExpanded ? 'auto' : 'hidden',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">Prompt</h3>
        {shouldTruncate && (
          <button
            onClick={handleToggle}
            className="text-xs font-medium text-accent-primary hover:text-accent-hover transition-colors flex items-center gap-1"
            aria-expanded={isExpanded}
            aria-controls="prompt-text"
          >
            {isExpanded ? 'Less' : 'More'}
            <svg
              className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      <div className="relative">
        <div
          ref={textRef}
          id="prompt-text"
          className="bg-background-secondary border border-border rounded-lg p-4 font-mono text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-words"
          style={containerStyle}
        >
          {prompt}
        </div>
        {!isExpanded && shouldTruncate && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background-secondary to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}