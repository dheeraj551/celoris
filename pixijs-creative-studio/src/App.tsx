import React, { useState, useCallback } from 'react';
import { SmartBoardMode, Student, ChatMessage, CameraPreset } from './types';
import { INITIAL_STUDENTS, INITIAL_CHAT, PRESET_VIDEOS } from './data/initialData';
import { ClassroomHeader } from './components/ClassroomHeader';
import { RightSidebar } from './components/RightSidebar';
import { Classroom3DCanvas } from './components/Classroom3DCanvas';
import { StudentActionModal } from './components/StudentActionModal';

export function App() {
  // State
  const [courseTitle, setCourseTitle] = useState('Physics 201');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [smartBoardMode, setSmartBoardMode] = useState<SmartBoardMode>('ready');
  const [videoUrl, setVideoUrl] = useState<string>(PRESET_VIDEOS[0].url);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [modalStudent, setModalStudent] = useState<Student | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('teacher');

  // Realtime Student Names Pool for dynamic joining
  const REALTIME_POOL = [
    { name: 'Alex', color: '#10b981' },
    { name: 'Elena', color: '#8b5cf6' },
    { name: 'Lucas', color: '#f59e0b' },
    { name: 'Maya', color: '#ec4899' },
    { name: 'Kenji', color: '#06b6d4' },
    { name: 'Priya', color: '#f97316' },
    { name: 'Liam', color: '#3b82f6' },
    { name: 'Chloe', color: '#14b8a6' },
    { name: 'Mateo', color: '#a855f7' },
    { name: 'Amina', color: '#eab308' },
    { name: 'Sora', color: '#6366f1' },
    { name: 'Zara', color: '#ef4444' },
    { name: 'Noah', color: '#22c55e' },
    { name: 'Hana', color: '#f43f5e' },
  ];

  // Audio effects synthesizer for classroom feedback
  const playSound = useCallback((type: 'chime' | 'chalk' | 'pop') => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      const ctx = new AudioContext();

      if (type === 'chime') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // Ignore audio failure
    }
  }, [isMuted]);

  // Handler to seat a realtime student dynamically
  const handleAddNextStudent = useCallback(() => {
    if (students.length >= 40) return;

    const availablePool = REALTIME_POOL.filter(
      (p) => !students.some((s) => s.name.toLowerCase() === p.name.toLowerCase())
    );
    const candidate = availablePool[0] || {
      name: `Student ${students.length + 1}`,
      color: '#38bdf8',
    };

    const newStudentId = `student-${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name: candidate.name,
      isHandRaised: Math.random() > 0.6,
      status: 'present',
      row: Math.min(5, Math.floor(students.length / 8) + 1),
      col: 0,
      color: candidate.color,
    };

    setStudents((prev) => [...prev, newStudent]);
    playSound('chime');

    // Notify in chat
    const joinMsg: ChatMessage = {
      id: `join-${Date.now()}`,
      sender: 'Class System',
      isTeacher: false,
      text: `✨ ${candidate.name} has joined the auditorium lecture hall and taken a seat!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarColor: '#10b981',
    };
    setChatMessages((prev) => [...prev, joinMsg]);
  }, [students, playSound]);

  // Handler when clicking a specific empty seat in the 3D hall
  const handleAddStudentToSeat = useCallback((seatCode: string) => {
    const availablePool = REALTIME_POOL.filter(
      (p) => !students.some((s) => s.name.toLowerCase() === p.name.toLowerCase())
    );
    const candidate = availablePool[0] || {
      name: `Student ${students.length + 1}`,
      color: '#38bdf8',
    };

    const newStudentId = `student-${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name: candidate.name,
      isHandRaised: false,
      status: 'present',
      row: 3,
      col: 0,
      seatCode: seatCode,
      color: candidate.color,
    };

    setStudents((prev) => [...prev, newStudent]);
    setSelectedStudentId(newStudentId);
    playSound('chime');

    const joinMsg: ChatMessage = {
      id: `join-${Date.now()}`,
      sender: 'Class System',
      isTeacher: false,
      text: `✨ ${candidate.name} is now seated at Seat ${seatCode}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarColor: candidate.color,
    };
    setChatMessages((prev) => [...prev, joinMsg]);
  }, [students, playSound]);

  // Derived metrics
  const presentCount = students.filter((s) => s.status === 'present').length;
  const handsCount = students.filter((s) => s.isHandRaised && s.status === 'present').length;
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || null;

  // Student Actions
  const handleToggleStudentHand = useCallback((studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const next = !s.isHandRaised;
          if (next) playSound('chime');
          return { ...s, isHandRaised: next };
        }
        return s;
      })
    );
  }, [playSound]);

  const handleToggleStudentStatus = useCallback((studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const nextStatus = s.status === 'present' ? 'away' : 'present';
          return { ...s, status: nextStatus, isHandRaised: nextStatus === 'away' ? false : s.isHandRaised };
        }
        return s;
      })
    );
  }, []);

  const handleSelectStudentFromCanvas = useCallback((student: Student) => {
    setSelectedStudentId(student.id);
    setModalStudent(student);
    playSound('pop');
  }, [playSound]);

  const handleCallOnStudent = useCallback((student: Student) => {
    playSound('chime');
    setSelectedStudentId(student.id);

    // Lower student hand
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, isHandRaised: false } : s))
    );

    // Add teacher speech in chat
    const teacherMsgId = `msg-${Date.now()}`;
    const teacherMsg: ChatMessage = {
      id: teacherMsgId,
      sender: 'Teacher',
      isTeacher: true,
      text: `${student.name}, please go ahead with your question or observation!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, teacherMsg]);

    // Student responds realistically in chat after 1.2 seconds!
    setTimeout(() => {
      const studentResponses: Record<string, string> = {
        mei: 'Thanks! When we decrease slit distance d, does the fringe width Δy increase proportionally?',
        ivan: 'Got it, so constructive interference happens whenever path difference is an integer multiple of λ!',
        leah: 'Understood! Does this also apply to sound waves and radio waves?',
        nour: 'Could you re-explain how the central maximum brightness compares to higher order fringes?',
        rin: 'Thank you teacher! The ray diagram on the board makes the derivation very clear.',
      };

      const responseText = studentResponses[student.id] || `Thank you teacher! I understand the concept now.`;

      const studentReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: student.name,
        isTeacher: false,
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarColor: student.color,
      };
      setChatMessages((prev) => [...prev, studentReply]);
      playSound('chime');
    }, 1200);
  }, [playSound]);

  const handleSendPraise = useCallback((student: Student, praiseText: string) => {
    const praiseMsg: ChatMessage = {
      id: `praise-${Date.now()}`,
      sender: 'Teacher',
      isTeacher: true,
      text: praiseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, praiseMsg]);
    playSound('pop');
  }, [playSound]);

  // Chat message send
  const handleSendMessage = useCallback((text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Teacher',
      isTeacher: true,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    playSound('pop');
  }, [playSound]);

  // SmartBoard video trigger
  const handlePlayVideoFromSidebar = () => {
    setSmartBoardMode('video');
    playSound('pop');
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#070b14] text-slate-100 font-sans overflow-hidden">
      {/* 1. TOP CLASSROOM HEADER */}
      <ClassroomHeader
        courseTitle={courseTitle}
        onCourseTitleChange={setCourseTitle}
        presentCount={presentCount}
        handsCount={handsCount}
        onSoundToggle={() => setIsMuted((prev) => !prev)}
        isMuted={isMuted}
      />

      {/* 2. MAIN SPLIT VIEW (Classroom Stage + Right Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 3D Interactive Grand Lecture Hall (Tiered Floor, 40 Seats, 3D Avatars, In-World 3D Smart Board) */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          <Classroom3DCanvas
            students={students}
            selectedStudentId={selectedStudentId}
            onSelectStudent={handleSelectStudentFromCanvas}
            onClearSelection={() => setSelectedStudentId(null)}
            onCallOnStudent={handleCallOnStudent}
            onToggleStudentHand={handleToggleStudentHand}
            cameraPreset={cameraPreset}
            onCameraPresetChange={setCameraPreset}
            onAddNextStudent={handleAddNextStudent}
            onAddStudentToSeat={handleAddStudentToSeat}
          />
        </main>

        {/* Right Sidebar: Smart Board Controls, 2-Column Students List, Class Chat */}
        <RightSidebar
          mode={smartBoardMode}
          onModeChange={setSmartBoardMode}
          videoUrl={videoUrl}
          onVideoUrlChange={setVideoUrl}
          onPlayVideo={handlePlayVideoFromSidebar}
          students={students}
          onToggleStudentHand={handleToggleStudentHand}
          onToggleStudentStatus={handleToggleStudentStatus}
          selectedStudentId={selectedStudentId}
          onSelectStudent={(id) => setSelectedStudentId(id)}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          onCallOnStudent={handleCallOnStudent}
          onAddNextStudent={handleAddNextStudent}
        />
      </div>

      {/* Student Action Modal (Teacher Desk Interactivity) */}
      {modalStudent && (
        <StudentActionModal
          student={modalStudent}
          onClose={() => setModalStudent(null)}
          onToggleHand={handleToggleStudentHand}
          onToggleStatus={handleToggleStudentStatus}
          onCallOn={handleCallOnStudent}
          onSendPraise={handleSendPraise}
        />
      )}
    </div>
  );
}

export default App;
