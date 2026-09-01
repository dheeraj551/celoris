/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeminiSparkle } from './components/GeminiSparkle';
import { PromptBox, FileItem } from './components/PromptBox';
import { InspirationCards } from './components/InspirationCards';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { ModelLogosMarquee } from './components/ModelLogosMarquee';
import { Message } from './types';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<FileItem[]>([]);
  const [activeCapabilityTag, setActiveCapabilityTag] = useState<string | undefined>(undefined);
  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Flash Lite');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  // Auto scroll to bottom during chat streaming
  useEffect(() => {
    if (hasMessages) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  const handleAddAttachment = (file: FileItem) => {
    setSelectedAttachments((prev) => [...prev, file]);
  };

  const handleRemoveAttachment = (id: string) => {
    setSelectedAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectCapability = (capabilityPrompt: string, tag?: string) => {
    setPrompt(capabilityPrompt);
    if (tag) setActiveCapabilityTag(tag);
    // Focus prompt input
    const input = document.getElementById('gemini-prompt-input');
    input?.focus();
  };

  const handleSubmit = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt ?? prompt).trim();
    if ((!textToSend && selectedAttachments.length === 0) || isGenerating) return;

    const userMessageId = Math.random().toString(36).substring(2, 9);
    const assistantMessageId = Math.random().toString(36).substring(2, 9);

    const newUserMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: textToSend || 'Please review the attached project files and generate an implementation plan.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: [...selectedAttachments],
      capabilityTag: activeCapabilityTag,
    };

    const newAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, newUserMessage, newAssistantMessage]);
    setPrompt('');
    setSelectedAttachments([]);
    setActiveCapabilityTag(undefined);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          contextType: activeCapabilityTag,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedContent = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          
          // If the chunk doesn't look like Vercel Data Stream or SSE, it's raw text
          if (!chunkText.includes('0:"') && !chunkText.includes('data: ')) {
            accumulatedContent += chunkText;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
            continue;
          }

          // Otherwise fall back to line-by-line parsing for older formats
          buffer += chunkText;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2));
                if (typeof text === 'string') {
                  accumulatedContent += text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId ? { ...msg, content: accumulatedContent } : msg
                    )
                  );
                }
              } catch (e) {}
            } else if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.text) {
                  accumulatedContent += data.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId ? { ...msg, content: accumulatedContent } : msg
                    )
                  );
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackResponse = `I'm having trouble connecting right now. Please check your internet connection and try again in a moment. 🙏

If the issue persists, the AI service might be temporarily unavailable.`;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, content: fallbackResponse } : msg
        )
      );
    } finally {
      setIsGenerating(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  };

  const handleReset = () => {
    setMessages([]);
    setPrompt('');
    setSelectedAttachments([]);
    setActiveCapabilityTag(undefined);
  };

  const handleRetry = () => {
    if (messages.length >= 2) {
      const lastUserMsg = messages[messages.length - 2];
      if (lastUserMsg && lastUserMsg.role === 'user') {
        handleSubmit(lastUserMsg.content);
      }
    }
  };

  return (
    <div className="relative flex flex-row h-full w-full bg-[#0d0e12] text-[#e3e3e3] font-sans selection:bg-[#4b90ff]/30 selection:text-white overflow-hidden">
      {/* Creative Background with 50% Opacity on Deep Black Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black select-none">
        <img
          src="/a-studio-portrait-of-a-young-woman-inten_Vin-LeGCW4ev4hLZnZiScQ_aYuKUONVQgmpuXm-B_Tb7g.jpg"
          alt="Student studying with AI companion"
          className="w-full h-full object-cover object-center opacity-50 filter brightness-90 contrast-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft Vignette & Gradient Overlays for optimal readability and depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131314] via-[#131314]/75 to-[#131314]/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#131314]/85 via-transparent to-[#131314]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#131314]/40 to-[#131314]/95" />
      </div>

      {/* Main App Content View */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative z-10">
        {/* Top Header */}
        <Header
          onReset={handleReset}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          hasMessages={hasMessages}
        />

        {/* Scrollable body */}
        <main className="flex-1 flex flex-col items-center px-4 sm:px-8 max-w-5xl w-full mx-auto py-6 sm:py-8">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              /* Sleek Landing State matching exact design aesthetic */
              <motion.div
                key="hero-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="w-full flex flex-col my-auto max-w-4xl"
              >
                {/* Hero Greeting text from Sleek Interface design */}
                <div className="mb-6 sm:mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight bg-gradient-to-r from-[#4b90ff] via-[#9171f8] via-[#bd5fff] via-[#f35a76] to-[#fb9709] bg-clip-text text-transparent">
                      Hello, Student!
                    </h1>
                    <GeminiSparkle size={36} glow={true} className="flex-shrink-0" />
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#444746] dark:text-[#8e918f] mt-1">
                    What do you want to learn today?
                  </h2>
                </div>

                {/* 4 Sleek Inspiration Cards */}
                <InspirationCards onSelectCard={handleSelectCapability} />

                {/* Prompt Box */}
                <div className="w-full">
                  <PromptBox
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onSubmit={handleSubmit}
                    isGenerating={isGenerating}
                    selectedAttachments={selectedAttachments}
                    onAddAttachment={handleAddAttachment}
                    onRemoveAttachment={handleRemoveAttachment}
                  />
                </div>

                {/* Animated Looped Strips of AI Models ("Powered By" section) */}
                <ModelLogosMarquee
                  selectedModel={selectedModel}
                  onSelectModel={setSelectedModel}
                />
              </motion.div>
            ) : (
              /* Active Chat View */
              <motion.div
                key="chat-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex-1 flex flex-col justify-between"
              >
                <ChatView
                  messages={messages}
                  isGenerating={isGenerating}
                  onFollowUp={(followUpText) => handleSubmit(followUpText)}
                  onRetry={handleRetry}
                />

                <div ref={chatBottomRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Sticky Bottom Prompt Bar when in active chat view */}
        {hasMessages && (
          <footer className="sticky bottom-0 w-full bg-[#131314]/95 backdrop-blur-xl border-t border-[#333537] py-3.5 px-4 sm:px-8 z-30">
            <div className="max-w-4xl mx-auto">
              <PromptBox
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleSubmit}
                isGenerating={isGenerating}
                selectedAttachments={selectedAttachments}
                onAddAttachment={handleAddAttachment}
                onRemoveAttachment={handleRemoveAttachment}
                compact={true}
              />
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

