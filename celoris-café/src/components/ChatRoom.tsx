import React, { useState, useEffect, useRef } from 'react';
import { Room, ChatMessage, User } from '../types';
import { MOCK_CHATS, AUTO_RESPONSES } from '../data/mockData';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Tv, 
  Users, 
  PhoneOff, 
  Smile, 
  Paperclip,
  Check,
  ShieldCheck,
  Award
} from 'lucide-react';

interface ChatRoomProps {
  room: Room;
  onLeave: () => void;
  currentUser: { name: string; avatar: string; skill: string; college: string };
}

export default function ChatRoom({ room, onLeave, currentUser }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [talkingUser, setTalkingUser] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages for the room
  useEffect(() => {
    const initialChats = MOCK_CHATS[room.id] || [];
    setMessages(initialChats);
  }, [room.id]);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Simulate speaking users periodically to make the audio lobby feel alive!
  useEffect(() => {
    if (room.id === 'room-study') return; // study table is silent

    const interval = setInterval(() => {
      if (room.participants.length > 0) {
        // Pick a random participant to speak
        const nonTrainerParticipants = room.participants.filter(p => !p.isTrainer);
        if (nonTrainerParticipants.length > 0) {
          const randomUser = nonTrainerParticipants[Math.floor(Math.random() * nonTrainerParticipants.length)];
          setTalkingUser(randomUser.name);
          setTimeout(() => {
            setTalkingUser(null);
          }, 3000);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [room]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-self-${Date.now()}`,
      roomId: room.id,
      userId: 'self',
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    setMessages(prev => [...prev, userMsg]);
    const typedText = inputText;
    setInputText('');

    // Check if we have automatic simulated responses for this room
    const responses = AUTO_RESPONSES[room.id];
    if (responses && responses.length > 0) {
      // Pick a response
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Simulate typing status
      setTimeout(() => {
        setIsTyping(randomResponse.senderName);
      }, 1000);

      // Add response
      setTimeout(() => {
        setIsTyping(null);
        const botMsg: ChatMessage = {
          id: `m-bot-${Date.now()}`,
          roomId: room.id,
          userId: `bot-${randomResponse.senderName}`,
          userName: randomResponse.senderName,
          userAvatar: randomResponse.avatar,
          text: randomResponse.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        
        // Make the bot speak in the audio panel if they spoke in chat
        if (room.id !== 'room-study') {
          setTalkingUser(randomResponse.senderName);
          setTimeout(() => setTalkingUser(null), 2500);
        }
      }, randomResponse.delay);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] bg-[#080808] rounded-2xl border border-emerald-950/30 overflow-hidden">
      
      {/* LEFT PANEL: Virtual Table / Active seats & Audio room status */}
      <div className="w-full lg:w-[350px] bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-emerald-950/30 flex flex-col justify-between shrink-0">
        
        {/* Table Header */}
        <div className="p-4 border-b border-emerald-950/20 bg-gradient-to-b from-emerald-950/10 to-transparent">
          <button 
            onClick={onLeave}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leave Student Table</span>
          </button>
          
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {room.name}
          </h2>
          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Members Sitting at Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Active Seats</span>
            <span className="text-[10px] text-gray-500 font-mono font-bold">
              {room.participants.length + 1} / 8 seated
            </span>
          </div>

          <div className="grid gap-3">
            {/* Current user's seat */}
            <div className={`
              flex items-center justify-between p-3 rounded-xl border transition-all duration-300
              ${!isMuted ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.08)]' : 'bg-[#121212]/80 border-transparent'}
            `}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className={`w-10 h-10 rounded-full object-cover border-2 ${!isMuted ? 'border-emerald-500' : 'border-emerald-500/20'}`}
                  />
                  {!isMuted && (
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-[#0a0a0a]">
                      <Mic className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-white leading-tight">
                    {currentUser.name} (You)
                  </span>
                  <span className="text-[10px] text-gray-500 leading-none">
                    {currentUser.skill}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {isCameraOn && (
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase font-mono font-bold">
                    Cam Live
                  </span>
                )}
                <span className="text-[10px] text-emerald-500/80 font-semibold uppercase tracking-wider bg-emerald-950/20 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
            </div>

            {/* Other participants */}
            {room.participants.map((participant) => {
              const isSpeaking = talkingUser === participant.name;
              return (
                <div 
                  key={participant.id}
                  className={`
                    flex items-center justify-between p-3 rounded-xl border transition-all duration-300
                    ${isSpeaking ? 'bg-emerald-950/30 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.12)] scale-[1.01]' : 'bg-[#121212]/40 border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={participant.avatar} 
                        alt={participant.name} 
                        className={`w-10 h-10 rounded-full object-cover border-2 ${isSpeaking ? 'border-emerald-400 animate-pulse' : 'border-zinc-800'}`}
                      />
                      {isSpeaking && (
                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-400 text-[#0a0a0a] animate-bounce">
                          <Mic className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span className="block text-xs font-bold text-white leading-tight">{participant.name}</span>
                        {participant.isTrainer && (
                          <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1 rounded-sm font-bold">MEMBER</span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 leading-none">
                        {participant.skill}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Simulated speaking waves */}
                    {isSpeaking ? (
                      <div className="flex items-end gap-0.5 h-3">
                        <div className="w-0.5 bg-emerald-400 rounded animate-[pulse_0.6s_infinite_100ms] h-3"></div>
                        <div className="w-0.5 bg-emerald-400 rounded animate-[pulse_0.6s_infinite_200ms] h-2"></div>
                        <div className="w-0.5 bg-emerald-400 rounded animate-[pulse_0.6s_infinite_300ms] h-3.5"></div>
                      </div>
                    ) : (
                      <MicOff className="w-3.5 h-3.5 text-zinc-700" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Audio Controls Panel */}
        <div className="p-4 border-t border-emerald-950/20 bg-gradient-to-t from-emerald-950/10 to-transparent space-y-3">
          {room.id === 'room-study' ? (
            <div className="text-center py-2.5 px-3 rounded-xl bg-emerald-950/10 border border-emerald-500/10">
              <span className="text-[11px] text-emerald-400 font-bold block mb-0.5 uppercase tracking-widest">SILENT CO-WORKING</span>
              <span className="text-[10px] text-gray-500 block">Mics disabled automatically inside this room.</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              {/* Mic toggle */}
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`
                  p-3 rounded-2xl border transition-all duration-300 flex items-center justify-center cursor-pointer
                  ${isMuted 
                    ? 'bg-zinc-900 text-gray-400 border-zinc-800 hover:bg-zinc-800' 
                    : 'bg-emerald-500 text-[#0a0a0a] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:bg-emerald-400'}
                `}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 stroke-[2.5]" />}
              </button>

              {/* Camera toggle */}
              <button 
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`
                  p-3 rounded-2xl border transition-all duration-300 flex items-center justify-center cursor-pointer
                  ${!isCameraOn 
                    ? 'bg-zinc-900 text-gray-400 border-zinc-800 hover:bg-zinc-800' 
                    : 'bg-emerald-500 text-[#0a0a0a] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:bg-emerald-400'}
                `}
                title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isCameraOn ? <Video className="w-5 h-5 stroke-[2.5]" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Screen Share Toggle */}
              <button 
                onClick={() => setIsSharingScreen(!isSharingScreen)}
                className={`
                  p-3 rounded-2xl border transition-all duration-300 flex items-center justify-center cursor-pointer
                  ${!isSharingScreen 
                    ? 'bg-zinc-900 text-gray-400 border-zinc-800 hover:bg-zinc-800' 
                    : 'bg-emerald-500 text-[#0a0a0a] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:bg-emerald-400'}
                `}
                title={isSharingScreen ? 'Stop screen sharing' : 'Share screen'}
              >
                <Tv className="w-5 h-5" />
              </button>

              {/* Disconnect */}
              <button 
                onClick={onLeave}
                className="p-3 rounded-2xl bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="Disconnect table session"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Dynamic Chat Stream */}
      <div className="flex-1 flex flex-col justify-between bg-[#0a0a0a]">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-emerald-950/20 bg-gradient-to-r from-emerald-950/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Student Discussion Desk</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">CHATROOM</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">Auto-archiving active</span>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-2xl ${msg.isSelf ? 'ml-auto flex-row-reverse text-right' : ''}`}
            >
              {/* Profile pic */}
              <img 
                src={msg.userAvatar} 
                alt={msg.userName} 
                className="w-10 h-10 rounded-xl object-cover border border-emerald-950/20"
              />

              {/* Body */}
              <div className="space-y-1">
                <div className={`flex items-center gap-2 ${msg.isSelf ? 'justify-end' : ''}`}>
                  <span className="text-xs font-bold text-white">{msg.userName}</span>
                  {msg.isTrainer && (
                    <span className="text-[9px] bg-teal-500/15 text-teal-400 border border-teal-500/30 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">Coach</span>
                  )}
                  <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                </div>

                <div className={`
                  p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.isSelf 
                    ? 'bg-emerald-500 text-[#0a0a0a] font-medium rounded-tr-none' 
                    : 'bg-[#121212]/90 text-gray-300 border border-emerald-950/10 rounded-tl-none'}
                `}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3.5 max-w-sm animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/10 border border-emerald-950/30 flex items-center justify-center text-xs text-emerald-400 font-bold">
                ...
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500">{isTyping} is writing...</span>
                <div className="bg-[#121212] p-3 rounded-2xl rounded-tl-none border border-emerald-950/10 flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input box form */}
        <form 
          onSubmit={handleSendMessage}
          className="p-4 border-t border-emerald-950/20 bg-[#090909]"
        >
          <div className="relative flex items-center bg-[#121212] rounded-2xl border border-emerald-950/40 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 px-3 py-2 transition-all">
            
            {/* Attachment */}
            <button 
              type="button"
              className="p-1.5 text-gray-500 hover:text-emerald-400 transition-colors"
              title="Attach screenshot or file"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Input field */}
            <input 
              type="text"
              placeholder={`Send a message to the desk...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-gray-500 px-3 py-1.5 text-sm"
            />

            {/* Emoji Selector Mockup */}
            <button 
              type="button"
              className="p-1.5 text-gray-500 hover:text-emerald-400 transition-colors"
              title="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Send CTA */}
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className={`
                p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer
                ${inputText.trim() 
                  ? 'bg-emerald-500 text-[#0a0a0a] shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:scale-105' 
                  : 'bg-zinc-800 text-gray-500 cursor-not-allowed'}
              `}
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
          <span className="block text-[11px] text-gray-500 text-center mt-2">
            ⚠️ Standard community rules apply: be supportive, stay professional, and strictly avoid spam.
          </span>
        </form>
      </div>
    </div>
  );
}
