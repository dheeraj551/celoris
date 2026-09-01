import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Plus, ArrowUp, Sparkles, X, Paperclip, FileCode, Image, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface PromptBoxProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onSubmit: (promptText?: string) => void;
  isGenerating: boolean;
  selectedAttachments: FileItem[];
  onAddAttachment: (file: FileItem) => void;
  onRemoveAttachment: (id: string) => void;
  compact?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'code' | 'doc';
  previewUrl?: string;
}

export const PromptBox: React.FC<PromptBoxProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  isGenerating,
  selectedAttachments,
  onAddAttachment,
  onRemoveAttachment,
  compact = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  // Setup Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setPrompt(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [setPrompt]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice dictation is supported in modern browsers like Chrome/Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((prompt.trim() || selectedAttachments.length > 0) && !isGenerating) {
        onSubmit();
      }
    }
  };

  const handleLuckyClick = async () => {
    try {
      // Trigger festive sparkle confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#4285F4', '#9B72CB', '#D96570', '#FBBC04', '#34A853'],
      });

      const response = await fetch('/api/lucky-ideas');
      if (response.ok) {
        const data = await response.json();
        if (data.idea) {
          typeWriterEffect(data.idea);
        }
      } else {
        const fallbackIdeas = [
          'Build an Android app for personal workout tracking with offline SQLite sync and rest timer widgets',
          'Create a Gmail automated workflow that scans customer inquiries and updates Google Sheets',
          'Design an AI document summarizer with citation links and Google Drive export',
          'Build a voice-controlled meeting notes assistant connected to Google Calendar',
        ];
        const randomIdea = fallbackIdeas[Math.floor(Math.random() * fallbackIdeas.length)];
        typeWriterEffect(randomIdea);
      }
    } catch (err) {
      console.error('Failed to fetch lucky idea:', err);
    }
  };

  const typeWriterEffect = (text: string) => {
    setPrompt('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setPrompt(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 18);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const isCode = file.name.match(/\.(ts|tsx|js|jsx|json|html|css|py|java|kt|cpp)$/i);
      
      const fileItem: FileItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: isImg ? 'image' : isCode ? 'code' : 'doc',
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      };
      onAddAttachment(fileItem);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowAttachMenu(false);
  };

  return (
    <div className="w-full relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.json,.txt,.md,.js,.ts,.tsx,.jsx,.py,.kt,.html"
      />

      {/* RGB border wrapper - only the 2px padding is coloured */}
      <div className="rgb-running-border rounded-[2rem] p-[2px] shadow-2xl relative">
        <div className="rgb-running-border-glow" />
        {/* Dark inner box */}
        <div className="relative rounded-[calc(2rem-2px)] bg-[#0d0e12] p-3 sm:p-4 z-10">
          <div className="flex flex-col justify-between min-h-[110px] sm:min-h-[125px]">
          
          {/* Attachments preview list */}
          {selectedAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 px-2">
              {selectedAttachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#2a2a2a] text-xs text-[#e3e3e3]"
                >
                  {att.type === 'image' && <Image className="w-3.5 h-3.5 text-[#8ab4f8]" />}
                  {att.type === 'code' && <FileCode className="w-3.5 h-3.5 text-[#81c995]" />}
                  {att.type === 'doc' && <FileText className="w-3.5 h-3.5 text-[#fdd663]" />}
                  <span className="max-w-[140px] truncate">{att.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(att.id)}
                    className="p-0.5 hover:text-red-400 text-gray-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Prompt input textarea */}
          <div className="flex-1 flex items-start px-2 pt-1">
            <textarea
              ref={textareaRef}
              id="gemini-prompt-input"
              rows={compact ? 1 : 2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="How can I help you today?"
              className="w-full bg-transparent text-[#e3e3e3] placeholder-[#707270] text-base sm:text-lg focus:outline-none resize-none leading-relaxed tracking-normal font-normal"
            />
          </div>

          {/* Voice listening indicator bar */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-2 py-1 text-xs text-cyan-400 font-medium"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span>Listening for your voice prompt... Speak naturally</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action footer inside prompt box */}
          <div className="flex items-center justify-between pt-2 px-1 border-t border-[#181818] mt-1">
            {/* Left action icons: Mic and Plus */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="voice-dictation-btn"
                onClick={toggleListening}
                className={`p-2.5 rounded-full transition-all duration-200 ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 ring-1 ring-red-400/50'
                    : 'text-[#c4c7c5] hover:bg-[#181818] hover:text-white'
                }`}
                title={isListening ? 'Stop listening' : 'Use voice dictation'}
                aria-label="Voice Dictation"
              >
                {isListening ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  id="attach-file-btn"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2.5 rounded-full text-[#c4c7c5] hover:bg-[#181818] hover:text-white transition-all duration-200"
                  title="Add attachment, code, or context"
                  aria-label="Add Attachment"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Attach dropdown menu */}
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-12 left-0 z-30 w-56 p-1.5 rounded-2xl bg-[#0f0f0f] border border-[#242424] shadow-2xl"
                    >
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#e3e3e3] hover:bg-[#1c1c1c] rounded-xl transition-colors text-left"
                      >
                        <Paperclip className="w-4 h-4 text-[#8ab4f8]" />
                        <span>Upload File or Spec</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt(prompt ? `${prompt} [Add REST/GraphQL API & Database Integration] ` : '[Add REST/GraphQL API & Database Integration] ');
                          setShowAttachMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#e3e3e3] hover:bg-[#1c1c1c] rounded-xl transition-colors text-left"
                      >
                        <FileCode className="w-4 h-4 text-[#81c995]" />
                        <span>Add Backend Architecture</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt(prompt ? `${prompt} [Include interactive dashboard UI components & charts] ` : '[Include interactive dashboard UI components & charts] ');
                          setShowAttachMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#e3e3e3] hover:bg-[#1c1c1c] rounded-xl transition-colors text-left"
                      >
                        <Image className="w-4 h-4 text-[#fdd663]" />
                        <span>Add Visual UI Components</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right actions: Up Arrow Send Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="feeling-lucky-btn"
                onClick={() => {
                  if (prompt.trim().length > 0 || selectedAttachments.length > 0) {
                    onSubmit();
                  } else {
                    handleLuckyClick();
                  }
                }}
                disabled={isGenerating}
                className={`p-2.5 rounded-full transition-all duration-200 shadow-md active:scale-95 flex items-center justify-center ${
                  prompt.trim().length > 0 || selectedAttachments.length > 0
                    ? 'bg-white text-[#000000] hover:bg-gray-200 shadow-lg'
                    : 'bg-[#181818] text-[#8e918f] hover:bg-[#242424] hover:text-white border border-[#262626]'
                }`}
                aria-label="Send prompt"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

    </div>
  );
};
