
import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import Peer from "./Peer";

const Conference = () => {
    const peers = useHMSStore(selectPeers);

    return (
        <div className="w-full h-full p-4">
            {peers.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-500">
                    Waiting for others to join...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
                    {peers.map((peer) => (
                        <Peer key={peer.id} peer={peer} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Conference;
