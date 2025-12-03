import React, { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { fetchLiveKitToken } from "@/lib/livekit";

const LiveClassroom: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // In a real app, you'd get the user identity from your auth system
  const identity = "student_" + Math.floor(Math.random() * 10000);
  const room = "demo-classroom";

  useEffect(() => {
    fetchLiveKitToken(identity, room).then((data) => {
      setToken(data.token);
    }).catch(err => {
      console.error("Failed to connect to LiveKit", err);
      setError(err.message);
    });
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-4">
        <div className="text-red-500 font-semibold">Failed to connect to classroom</div>
        <p className="text-slate-600 text-sm">{error}</p>
        <p className="text-slate-500 text-xs max-w-md text-center">
          Note: If you are seeing an "invalid API key" error, please check your LiveKit Cloud configuration.
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={true}
        video={true}
        data-lk-theme="default"
        style={{ height: '100%' }}
        onError={(err) => setError(err.message)}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
};

export default LiveClassroom;