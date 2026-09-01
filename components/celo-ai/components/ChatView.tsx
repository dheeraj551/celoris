import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, Terminal, Code2, RefreshCw, Layers } from 'lucide-react';
import { GeminiSparkle } from './GeminiSparkle';
import { Message } from '../types';

interface ChatViewProps {
  messages: Message[];
  isGenerating: boolean;
  onFollowUp: (prompt: string) => void;
  onRetry: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isGenerating,
  onFollowUp,
  onRetry,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const followUpSuggestions = [
    'Add comprehensive error handling & state management',
    'Generate full UI component code & layout previews',
    'Write setup instructions & dependency commands',
    'Add Google Workspace OAuth integration logic',
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const isLastAssistant = !isUser && idx === messages.length - 1;

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`w-full flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
          >
            {/* User query card */}
            {isUser ? (
              <div className="max-w-2xl bg-[#282a2c] text-[#e3e3e3] rounded-3xl rounded-tr-md px-5 py-3.5 border border-[#333537] shadow-md">
                {msg.capabilityTag && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#4b90ff]/15 text-[#4b90ff] border border-[#4b90ff]/30 mb-2">
                    {msg.capabilityTag}
                  </span>
                )}
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[#333537]">
                    {msg.attachments.map((att, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1e1f20] text-xs text-[#c4c7c5] border border-[#333537]"
                      >
                        <Code2 className="w-3 h-3 text-[#4b90ff]" />
                        {att.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Gemini response block */
              <div className="w-full flex items-start gap-3 sm:gap-4">
                {/* Gemini avatar */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#1e1f20] border border-[#333537] flex items-center justify-center shadow-sm">
                    <GeminiSparkle size={20} glow={false} />
                  </div>
                </div>

                {/* Response content */}
                <div className="flex-1 min-w-0 bg-[#1e1f20] backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#333537] shadow-lg">
                  {/* Thinking animation state */}
                  {msg.content === '' && isGenerating && (
                    <div className="flex flex-col gap-3 py-2">
                      <div className="flex items-center gap-2 text-sm text-[#4b90ff] font-medium">
                        <Sparkles className="w-4 h-4 animate-spin text-[#4b90ff]" />
                        <span className="shimmer-text">Celo AI is designing and building your solution...</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#131314] rounded-full overflow-hidden relative">
                        <motion.div
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.6,
                            ease: 'easeInOut',
                          }}
                          className="w-1/2 h-full bg-gradient-to-r from-[#4b90ff] via-[#bd5fff] to-[#fb9709] rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Rendered Markdown text */}
                  {msg.content !== '' && (
                    <div className="prose prose-invert max-w-none text-[#e3e3e3] text-sm sm:text-base leading-relaxed space-y-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match && !String(children).includes('\n');
                            const codeString = String(children).replace(/\n$/, '');

                            if (isInline) {
                              return (
                                <code
                                  className="bg-[#131314] text-[#4b90ff] px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono border border-[#333537]"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }

                            return (
                              <div className="relative my-4 rounded-xl overflow-hidden border border-[#333537] bg-[#131314]">
                                <div className="flex items-center justify-between px-4 py-2 bg-[#1a1b1c] border-b border-[#333537] text-xs text-[#8e918f] font-mono">
                                  <div className="flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-[#4b90ff]" />
                                    <span>{match ? match[1] : 'code'}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(codeString, `${msg.id}-${codeString.slice(0, 10)}`)}
                                    className="flex items-center gap-1 text-[#8e918f] hover:text-white transition-colors"
                                  >
                                    {copiedId === `${msg.id}-${codeString.slice(0, 10)}` ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-[#e3e3e3] leading-relaxed bg-[#131314]">
                                  <code>{children}</code>
                                </pre>
                              </div>
                            );
                          },
                          ul({ children }) {
                            return <ul className="list-disc pl-5 space-y-1 text-[#c4c7c5]">{children}</ul>;
                          },
                          ol({ children }) {
                            return <ol className="list-decimal pl-5 space-y-1 text-[#c4c7c5]">{children}</ol>;
                          },
                          h1({ children }) {
                            return <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-3 mb-2">{children}</h1>;
                          },
                          h2({ children }) {
                            return <h2 className="text-lg sm:text-xl font-semibold text-[#e3e3e3] tracking-tight mt-3 mb-2">{children}</h2>;
                          },
                          h3({ children }) {
                            return <h3 className="text-base sm:text-lg font-medium text-[#4b90ff] mt-2 mb-1">{children}</h3>;
                          },
                          p({ children }) {
                            return <p className="leading-relaxed mb-3 text-[#e3e3e3]">{children}</p>;
                          },
                          strong({ children }) {
                            return <strong className="font-semibold text-white">{children}</strong>;
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* Actions toolbar at bottom of Gemini message */}
                  {msg.content !== '' && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#333537]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8e918f] hover:text-[#e3e3e3] hover:bg-[#333537] transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy response</span>
                            </>
                          )}
                        </button>
                        {isLastAssistant && !isGenerating && (
                          <button
                            type="button"
                            onClick={onRetry}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8e918f] hover:text-[#e3e3e3] hover:bg-[#333537] transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Regenerate</span>
                          </button>
                        )}
                      </div>

                      <div className="text-[11px] text-[#8e918f] flex items-center gap-1">
                        <GeminiSparkle size={12} glow={false} />
                        <span>Celo AI</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Suggested next steps / follow-up chips if chat has finished */}
      {!isGenerating && messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-2 pl-12"
        >
          <p className="text-xs text-[#8e918f] font-medium mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#4b90ff]" />
            <span>Suggested follow-ups</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {followUpSuggestions.map((sugg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onFollowUp(sugg)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#1e1f20] hover:bg-[#333537] text-[#c4c7c5] hover:text-white border border-[#333537] hover:border-[#4b90ff]/50 transition-all duration-200 active:scale-95"
              >
                {sugg}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
