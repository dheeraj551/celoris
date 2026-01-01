
import {
    useAVToggle,
    useHMSActions
} from "@100mslive/react-sdk";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ControlBar = () => {
    const hmsActions = useHMSActions();
    const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();
    const router = useRouter();

    const handleLeave = async () => {
        await hmsActions.leave();
        router.push('/learn');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 md:static md:bg-transparent md:border-t-0 flex justify-center z-50">
            <div className="flex items-center gap-4 bg-white md:shadow-lg md:rounded-full md:px-6 md:py-3 border border-slate-100">
                <Button
                    variant={isLocalAudioEnabled ? "secondary" : "destructive"}
                    size="icon"
                    onClick={toggleAudio}
                    className={`rounded-full h-12 w-12 transition-all ${isLocalAudioEnabled ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : ''}`}
                >
                    {isLocalAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <Button
                    variant={isLocalVideoEnabled ? "secondary" : "destructive"}
                    size="icon"
                    onClick={toggleVideo}
                    className={`rounded-full h-12 w-12 transition-all ${isLocalVideoEnabled ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : ''}`}
                >
                    {isLocalVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>

                <Button
                    variant="destructive"
                    className="rounded-full px-6 bg-red-500 hover:bg-red-600 shadow-red-200 shadow-lg border-2 border-red-500"
                    onClick={handleLeave}
                >
                    <PhoneOff className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Leave Room</span>
                    <span className="sm:hidden">Leave</span>
                </Button>
            </div>
        </div>
    );
};

export default ControlBar;
