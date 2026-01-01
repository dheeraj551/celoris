
import { useVideo } from "@100mslive/react-sdk";

const Peer = ({ peer }: { peer: any }) => {
    const { videoRef } = useVideo({
        trackId: peer.videoTrack,
    });

    return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video shadow-lg">
            <video
                ref={videoRef}
                className={`w-full h-full object-cover ${peer.isLocal ? "-scale-x-100" : ""}`}
                autoPlay
                muted={peer.isLocal} // Avoid echo for local user
                playsInline
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-2">
                <span>{peer.name} {peer.isLocal ? "(You)" : ""}</span>
                {/* Optional: Add mic icon status here */}
            </div>
        </div>
    );
};

export default Peer;
