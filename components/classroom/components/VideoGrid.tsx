import React, { useEffect, useRef, useState } from 'react';
import { Icons } from './Icons';

interface VideoGridProps {
  isMicOn: boolean;
  isCamOn: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ isMicOn, isCamOn }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        if (isCamOn) {
          const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setStream(userStream);
          if (videoRef.current) {
            videoRef.current.srcObject = userStream;
          }
        } else {
           if (stream) {
             stream.getTracks().forEach(track => track.stop());
             setStream(null);
           }
        }
      } catch (err) {
        console.error("Camera access denied or failed", err);
      }
    };

    initCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCamOn]);

  // Mock participants
  const participants = [
    { id: 1, name: 'Alice W.', img: 'https://picsum.photos/seed/1/200' },
    { id: 2, name: 'Bob C.', img: 'https://picsum.photos/seed/2/200' },
    { id: 3, name: 'Charlie D.', img: 'https://picsum.photos/seed/3/200' },
    { id: 4, name: 'Dana E.', img: 'https://picsum.photos/seed/4/200' },
  ];

  return (
    <div className="h-full bg-slate-900 p-2 rounded-xl overflow-y-auto">
      <div className="grid grid-cols-2 gap-2 h-full">
        {/* Self View */}
        <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video shadow-md border border-slate-700">
          {isCamOn ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
          ) : (
             <div className="w-full h-full flex items-center justify-center">
               <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">You</div>
             </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-2">
            <span>You (Host)</span>
            {!isMicOn && <Icons.MicOff size={12} className="text-red-400" />}
          </div>
        </div>

        {/* Participants */}
        {participants.map(p => (
          <div key={p.id} className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video border border-slate-700">
            <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-80" />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {p.name}
            </div>
            {/* Mock Activity Indicator */}
            {Math.random() > 0.7 && (
              <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full border-2 border-slate-800"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;