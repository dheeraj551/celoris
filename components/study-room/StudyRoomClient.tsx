
"use client";

import { HMSRoomProvider } from "@100mslive/react-sdk";
import StudyRoomContent from "./StudyRoomContent";

export default function StudyRoomClient({ token, userName }: { token: string, userName: string }) {
    return (
        <HMSRoomProvider>
            <StudyRoomContent token={token} userName={userName} />
        </HMSRoomProvider>
    );
}
