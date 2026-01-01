"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    selectIsConnectedToRoom,
    useHMSActions,
    useHMSStore
} from "@100mslive/react-sdk";
import Conference from "./Conference";
import ControlBar from "./ControlBar";
import { Loader2, AlertCircle } from "lucide-react";

/**
 * Valid connection states: "Connected", "Connecting", "Disconnecting", "Disconnected", "Reconnecting", "Failed"
 */

const StudyRoomContent = ({ token, userName }: { token: string; userName: string }) => {
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const hmsActions = useHMSActions();
    const hasJoined = useRef(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const joinRoom = async () => {
            if (token && !isConnected && !hasJoined.current) {
                hasJoined.current = true;
                try {
                    await hmsActions.join({
                        userName: userName || `Guest-${Math.floor(Math.random() * 1000)}`,
                        authToken: token,
                    });
                } catch (e: any) {
                    console.error("Failed to join room", e);
                    setError(e.message || "Failed to join room");
                    hasJoined.current = false;
                }
            }
        };

        joinRoom();

        // Cleanup on unmount
        return () => {
            // We rely on the user clicking leave, or browser close. 
            // Auto-leaving on unmount can be tricky with React Strict Mode, 
            // but for production it's good practice.
            if (isConnected) {
                hmsActions.leave();
            }
        };
    }, [token, userName, isConnected, hmsActions]);

    if (error) {
        return (
            <div className="flex h-full items-center justify-center flex-col gap-4 text-red-500">
                <AlertCircle className="h-12 w-12" />
                <p>Failed to connect: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-blue-600 underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="flex h-full items-center justify-center flex-col gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                <p className="text-slate-500 font-medium">Entering Study Room...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-900">
            <div className="flex-1 overflow-hidden relative">
                <Conference />
            </div>
            <ControlBar />
        </div>
    );
};

export default StudyRoomContent;
