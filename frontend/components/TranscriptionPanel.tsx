import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessage[];
  liveInput: string;
  liveOutput: string;
  onSendMessage: (text: string) => void;
  isConnected: boolean;
  isAvatarVisible: boolean;
}

export const TranscriptionPanel: React.FC<Props> = ({ 
  isOpen,
  onClose,
  history,
  liveInput,
  liveOutput,
  onSendMessage,
  isConnected,
  isAvatarVisible
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, liveInput, liveOutput, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && isConnected) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const widthClass = isOpen
    ? (isAvatarVisible ? 'w-80 md:w-96 opacity-100' : 'w-full md:flex-1 opacity-100')
    : 'w-0 opacity-0 border-transparent';

  return (
    <div
      className={`h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${widthClass}`}
    >
      <div className={`h-full flex flex-col min-w-[320px] ${isAvatarVisible ? 'w-80 md:w-96' : 'w-full'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Live Transcript
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title="Close Panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {history.length === 0 && !liveInput && !liveOutput && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-sm text-center px-4 gap-3">
              <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <p>Start the conversation to see the transcript here.</p>
            </div>
          )}

          {history.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200 dark:border-gray-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {liveInput && (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed bg-blue-600/70 text-white rounded-br-sm animate-pulse">
                {liveInput}
              </div>
            </div>
          )}

          {liveOutput && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed bg-gray-100/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200/50 dark:border-gray-700/50 animate-pulse">
                {liveOutput}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isConnected ? "Type a message..." : "Connect to chat..."}
              disabled={!isConnected}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!isConnected || !inputText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded-full transition-colors shadow-sm flex items-center justify-center"
              title="Send Message"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M2 3v18l20-9zm2 11 9-2-9-2V6.09L17.13 12 4 17.91z"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
