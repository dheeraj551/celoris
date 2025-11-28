import React, { useState } from 'react';
import VideoGrid from '../components/VideoGrid';
import Whiteboard from '../components/Whiteboard';
import { Icons } from '../components/Icons';
import { generateQuizFromNotes } from '../services/geminiService';

const LiveClassroom: React.FC = () => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'board' | 'materials'>('board');
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([
    { sender: 'System', text: 'Class started at 09:00 AM' },
    { sender: 'Alice W.', text: 'Can you explain the useEffect dependency array again?' },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleEndCall = () => {
    if (window.confirm("End class for all students?")) {
      // Logic to end call
    }
  };

  const handleAskAI = async () => {
    setAiLoading(true);
    const context = "We are discussing React Hooks, specifically useEffect and useState.";
    const quiz = await generateQuizFromNotes(context);
    setMessages(prev => [...prev, { sender: 'EduBot (AI)', text: `Quick Quiz Generated:\n\n${quiz}` }]);
    setAiLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4">
      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Left Column: Whiteboard (Dominant) */}
        <div className="flex-[2] flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('board')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'board' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Interactive Whiteboard
              </button>
              <button 
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'materials' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Class Materials
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Recording • 00:45:23
            </div>
          </div>

          <div className="flex-1 min-h-0">
             {activeTab === 'board' ? (
               <Whiteboard isActive={true} />
             ) : (
               <div className="bg-white h-full rounded-xl p-6 shadow-sm border border-slate-200">
                 <h3 className="text-lg font-semibold mb-4">Shared Materials</h3>
                 <div className="space-y-2">
                    {['React_Patterns.pdf', 'Hooks_Cheatsheet.docx', 'Assignment_1.pdf'].map(f => (
                      <div key={f} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center">
                             <Icons.Download size={20} />
                          </div>
                          <span className="text-slate-700 font-medium">{f}</span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 text-primary text-sm font-medium">Present</button>
                      </div>
                    ))}
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Video Grid & Chat */}
        <div className={`flex-1 flex flex-col gap-4 transition-all duration-300 ${chatOpen ? 'max-w-sm' : 'max-w-[200px]'}`}>
          <div className="h-1/2 min-h-[200px]">
            <VideoGrid isMicOn={micOn} isCamOn={camOn} />
          </div>
          
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-700 text-sm">Class Chat</h3>
              <button onClick={() => handleAskAI} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-indigo-200 transition-colors" disabled={aiLoading}>
                <Icons.AI size={12} />
                {aiLoading ? 'Thinking...' : 'AI Quiz'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className={`text-xs font-bold ${m.sender.includes('System') ? 'text-slate-400' : m.sender.includes('AI') ? 'text-indigo-600' : 'text-slate-700'}`}>{m.sender}</span>
                  <p className={`text-sm ${m.sender.includes('System') ? 'text-slate-400 italic' : 'text-slate-600'} whitespace-pre-wrap`}>{m.text}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-200">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if(target.value.trim()) {
                      setMessages([...messages, {sender: 'You', text: target.value}]);
                      target.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Control Bar */}
      <div className="h-16 bg-slate-900 rounded-2xl flex items-center justify-between px-6 shadow-lg text-white">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">Advanced React Patterns</div>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="text-xs text-slate-400">24 Students Active</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setMicOn(!micOn)} className={`p-3 rounded-full transition-all ${micOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'}`}>
            {micOn ? <Icons.Mic size={20} /> : <Icons.MicOff size={20} />}
          </button>
          <button onClick={() => setCamOn(!camOn)} className={`p-3 rounded-full transition-all ${camOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'}`}>
            {camOn ? <Icons.Camera size={20} /> : <Icons.CameraOff size={20} />}
          </button>
          <button onClick={() => setScreenShare(!screenShare)} className={`p-3 rounded-full transition-all ${screenShare ? 'bg-green-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
            <Icons.ScreenShare size={20} />
          </button>
          <button className="p-3 rounded-full bg-slate-700 hover:bg-slate-600">
            <Icons.Hand size={20} />
          </button>
          <button onClick={() => setChatOpen(!chatOpen)} className={`p-3 rounded-full transition-all ${chatOpen ? 'bg-primary' : 'bg-slate-700 hover:bg-slate-600'}`}>
            <Icons.Chat size={20} />
          </button>
        </div>

        <div>
          <button onClick={handleEndCall} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-2">
            <Icons.Logout size={16} />
            End Class
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveClassroom;