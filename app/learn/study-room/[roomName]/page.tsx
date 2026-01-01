
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getOrCreateRoom, generateAppToken } from "@/lib/hms";
import StudyRoomClient from "@/components/study-room/StudyRoomClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function StudyRoomPage({ params }: { params: { roomName: string } }) {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect(`/login?next=/learn/study-room/${params.roomName}`);
    }

    const user = session.user;

    // Fetch user profile for display name
    let userName = "Student";
    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, username")
            .eq("id", user.id)
            .single();

        if (profile) {
            userName = profile.full_name || profile.username || userName;
        }
    } catch (e) {
        console.error("Error fetching profile", e);
    }

    const roomName = params.roomName;
    let token;

    try {
        // 1. Get or Create 100ms Room
        // We append "-study-room" to make sure it's unique/specific if needed, or just use raw name.
        // Let's use raw name for simplicity.
        const roomId = await getOrCreateRoom(roomName);

        // 2. Generate Token
        token = generateAppToken(roomId, user.id, "host");
    } catch (error) {
        console.error("Error setting up room:", error);
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md">
                    <h1 className="text-xl font-bold text-red-600 mb-2">Room Unavailable</h1>
                    <p className="text-slate-600 mb-4">We couldn't connect you to the study room. Please try again later.</p>
                    <a href="/learn" className="text-primary hover:underline">Return to Learn</a>
                </div>
            </div>
        );
    }

    return (
        <StudyRoomClient token={token} userName={userName} />
    );
}
