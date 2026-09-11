import React from 'react';
import './TerminalLoader.css';

interface TerminalLoaderProps {
  title?: string;
  text?: string;
  fullscreen?: boolean;
  fast?: boolean;
}

export const TerminalLoader: React.FC<TerminalLoaderProps> = ({
  title = 'Status',
  text = 'Loading...',
  fullscreen = false,
  fast = true
}) => {
  const content = (
    <div className={`terminal-loader ${fast ? 'fast' : ''}`}>
      <div className="terminal-header">
        <div className="terminal-title">{title}</div>
        <div className="terminal-controls">
          <div className="control close"></div>
          <div className="control minimize"></div>
          <div className="control maximize"></div>
        </div>
      </div>
      <div className="text">{text}</div>
    </div>
  );

  if (fullscreen) {
    return <div className="terminal-loader-overlay">{content}</div>;
  }

  return content;
};

