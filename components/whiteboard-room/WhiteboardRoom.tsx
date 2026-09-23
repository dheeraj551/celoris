"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ClassroomQueueGate } from "@/components/cafe/classroom3d/components/ClassroomQueueGate";
import { WhiteboardCanvas } from "./canvas/WhiteboardCanvas";
import { ToolBar } from "./canvas/ToolBar";
import { InsertImageModal } from "./canvas/InsertImageModal";
import { RoomTopBar } from "./RoomTopBar";
import { RoomSidePanel } from "./RoomSidePanel";
import { BoardReadOnlyContext } from "./boardContext";
import { useWhiteboardRoom } from "./hooks/useWhiteboardRoom";
import { screenShareService } from "./services/screenShareRegistry";
import { exportToHighResPng } from "./utils/inkEngine";
import type { CanvasCard, CardType, ScreenShareCard, ToolType, ViewportTransform } from "./types";

/**
 * Celoris Café — 2D whiteboard classroom.
 *
 * Layout comes from the "Realistic Whiteboard" AI-Studio prototype (ink
 * engine, paper textures, office/media cards). The live plumbing is Celoris':
 * the same seat/queue, Agora voice + screen share and Supabase presence the
 * 3D classroom uses, plus a server-checked event log for the board and chat
 * (only the trainer can change the board; everyone's chat name comes from
 * their real profile).
 */

interface WhiteboardRoomProps {
  roomId: string;
  roomName: string;
  isHost: boolean;
  onLeave: () => void;
}

const SCREEN_CARD_ID = "live-screenshare";

export default function WhiteboardRoom({ roomId, roomName, isHost, onLeave }: WhiteboardRoomProps) {
  const { user, profile } = useAuth() as any;
  const displayName: string = (profile?.full_name || "").trim() || (isHost ? "Trainer" : "Student");

  const room = useWhiteboardRoom({ roomId, isHost, userId: user?.id, displayName });

  // ------------------------------------------------------------ view + tools
  const [viewport, setViewport] = useState<ViewportTransform>({ x: 60, y: 40, zoom: 0.95 });
  const [currentTool, setCurrentTool] = useState<ToolType>(isHost ? "fountain-pen" : "hand-pan");
  const [currentColor, setCurrentColor] = useState("#1c1917");
  const [strokeSize, setStrokeSize] = useState(4.5);
  const [livePressure, setLivePressure] = useState(0.5);
  const [panelOpen, setPanelOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    if (room.boardError && room.boardLoaded) showToast(room.boardError);
  }, [room.boardError, room.boardLoaded, showToast]);

  // Lock page scroll behind the full-screen room.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ------------------------------------------------------------ unread chat
  const [seenChat, setSeenChat] = useState(0);
  useEffect(() => {
    if (panelOpen) setSeenChat(room.chat.length);
  }, [panelOpen, room.chat.length]);
  const unread = panelOpen ? 0 : Math.max(0, room.chat.length - seenChat);

  // ------------------------------------------------------------ helpers
  const stageCenterWorld = useCallback(() => {
    const rect = stageRef.current?.getBoundingClientRect();
    const w = rect?.width ?? window.innerWidth;
    const h = rect?.height ?? window.innerHeight;
    return { x: (w / 2 - viewport.x) / viewport.zoom, y: (h / 2 - viewport.y) / viewport.zoom };
  }, [viewport]);

  const nextZ = useCallback(() => room.board.cards.reduce((acc, c) => Math.max(acc, c.zIndex || 0), 10) + 1, [room.board.cards]);

  // ------------------------------------------------------------ live screen share card (local to each viewer)
  const [screenCard, setScreenCard] = useState<ScreenShareCard | null>(null);
  const dismissedStreamRef = useRef<MediaStream | null>(null);
  const presenter = room.participants.find((p) => p.isHost);

  useEffect(() => {
    const stream = room.screenStream;
    screenShareService.setStream(SCREEN_CARD_ID, stream);
    if (!stream) {
      setScreenCard(null);
      dismissedStreamRef.current = null;
      return;
    }
    if (dismissedStreamRef.current === stream) return;
    setScreenCard((existing) => {
      if (existing) return existing;
      const center = stageCenterWorld();
      const width = 760;
      const height = 470;
      return {
        id: SCREEN_CARD_ID,
        type: "screenshare",
        title: "Live screen",
        x: Math.round(center.x - width / 2),
        y: Math.round(center.y - height / 2),
        width,
        height,
        zIndex: 9000,
        data: {
          streamId: SCREEN_CARD_ID,
          presenterId: room.sharingScreen ? user?.id || "" : presenter?.id || "",
          presenterName: room.sharingScreen ? displayName : presenter?.name || "Trainer",
          presenterColor: "#16a34a",
          isLive: true,
          startedAt: Date.now(),
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.screenStream]);

  const cards: CanvasCard[] = useMemo(
    () => (screenCard ? [...room.board.cards, screenCard] : room.board.cards),
    [room.board.cards, screenCard]
  );

  const handleCardUpdate = useCallback(
    (cardId: string, updates: Partial<CanvasCard>) => {
      if (cardId === SCREEN_CARD_ID) {
        setScreenCard((c) =>
          c ? ({ ...c, ...updates, id: c.id, type: c.type, data: { ...c.data, ...((updates as any).data || {}) } } as ScreenShareCard) : c
        );
        return;
      }
      room.updateCard(cardId, updates);
    },
    [room]
  );

  const handleCardDelete = useCallback(
    (cardId: string) => {
      if (cardId === SCREEN_CARD_ID) {
        dismissedStreamRef.current = room.screenStream;
        setScreenCard(null);
        return;
      }
      room.deleteCard(cardId);
    },
    [room]
  );

  // ------------------------------------------------------------ inserting cards (trainer)
  const handleInsertImage = useCallback(
    (src: string, title = "Image", naturalWidth?: number, naturalHeight?: number, worldX?: number, worldY?: number) => {
      let w = 520;
      let h = 360;
      if (naturalWidth && naturalHeight) {
        const aspect = naturalWidth / naturalHeight;
        if (aspect >= 1) {
          w = Math.min(640, Math.max(360, naturalWidth));
          h = Math.round(w / aspect);
        } else {
          h = Math.min(500, Math.max(300, naturalHeight));
          w = Math.round(h * aspect);
        }
      }
      const center = stageCenterWorld();
      const x = worldX ?? center.x - w / 2;
      const y = worldY ?? center.y - (h + 40) / 2;
      room.addCard({
        id: `card-image-${Date.now()}`,
        type: "image",
        title: title.slice(0, 120),
        x: Math.round(x),
        y: Math.round(y),
        width: Math.max(320, Math.round(w)),
        height: Math.max(220, Math.round(h + 40)),
        zIndex: nextZ(),
        data: {
          src,
          alt: title.slice(0, 120),
          naturalWidth,
          naturalHeight,
          aspectRatio: naturalWidth && naturalHeight ? naturalWidth / naturalHeight : undefined,
          fitMode: "contain",
          rotation: 0,
        },
      });
    },
    [room, stageCenterWorld, nextZ]
  );

  const handleAddCard = useCallback(
    (type: Exclude<CardType, "screenshare">) => {
      if (type === "image") {
        setImageModalOpen(true);
        return;
      }
      const center = stageCenterWorld();
      const id = `card-${type}-${Date.now()}`;
      const z = nextZ();
      const at = (w: number, h: number) => ({ x: Math.round(center.x - w / 2), y: Math.round(center.y - h / 2), width: w, height: h, zIndex: z });

      if (type === "youtube") {
        room.addCard({ id, type, title: "YouTube video", ...at(560, 380), data: { url: "", videoId: "", title: "" } });
      } else if (type === "excel") {
        const cols = ["A", "B", "C", "D", "E", "F"];
        room.addCard({
          id,
          type,
          title: "Spreadsheet",
          ...at(680, 400),
          data: {
            fileName: "Spreadsheet.xlsx",
            activeSheetIndex: 0,
            sheets: [{ name: "Sheet1", columns: cols, rows: Array.from({ length: 12 }, () => cols.map(() => "")) }],
          },
        });
      } else if (type === "word") {
        room.addCard({
          id,
          type,
          title: "Document",
          ...at(580, 460),
          data: {
            docTitle: "Document",
            author: displayName,
            lastModified: "Just now",
            isHtml: true,
            content: "<p><em>Use “Open .docx File” to show a Word document here, or “Edit” to type notes for the class.</em></p>",
          },
        });
      } else if (type === "ppt") {
        room.addCard({
          id,
          type,
          title: "Slides",
          ...at(640, 430),
          data: {
            deckTitle: "Slides",
            currentSlide: 0,
            slides: [
              {
                title: "Open a .pptx file",
                subtitle: "Slide text and speaker notes load here. For the full design, share your screen instead.",
                bgTheme: "navy",
              },
            ],
          },
        });
      }
    },
    [room, stageCenterWorld, nextZ, displayName]
  );

  // ------------------------------------------------------------ view controls
  const zoomBy = (factor: number) =>
    setViewport((v) => {
      const rect = stageRef.current?.getBoundingClientRect();
      const cx = (rect?.width ?? window.innerWidth) / 2;
      const cy = (rect?.height ?? window.innerHeight) / 2;
      const zoom = Math.min(4, Math.max(0.2, v.zoom * factor));
      return { zoom, x: cx - (cx - v.x) * (zoom / v.zoom), y: cy - (cy - v.y) * (zoom / v.zoom) };
    });

  const fitContent = useCallback(() => {
    const { strokes } = room.board;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    cards.forEach((c) => {
      minX = Math.min(minX, c.x);
      minY = Math.min(minY, c.y);
      maxX = Math.max(maxX, c.x + c.width);
      maxY = Math.max(maxY, c.y + c.height);
    });
    strokes.forEach((s) =>
      s.points.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      })
    );
    if (!Number.isFinite(minX)) {
      setViewport({ x: 60, y: 40, zoom: 1 });
      return;
    }
    const rect = stageRef.current?.getBoundingClientRect();
    const sw = rect?.width ?? window.innerWidth;
    const sh = rect?.height ?? window.innerHeight;
    const pad = 80;
    const zoom = Math.min(1.5, Math.max(0.2, Math.min(sw / (maxX - minX + pad * 2), sh / (maxY - minY + pad * 2))));
    setViewport({ zoom, x: sw / 2 - ((minX + maxX) / 2) * zoom, y: sh / 2 - ((minY + maxY) / 2) * zoom });
  }, [room.board, cards]);

  const downloadBoard = async () => {
    const bg = room.board.texture === "dark-grid" ? "#0f172a" : "#fdfbf7";
    const dataUrl = await exportToHighResPng(room.board.strokes, 2, bg);
    if (!dataUrl) {
      showToast("Nothing written on the board yet.");
      return;
    }
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${roomName.replace(/[^\w-]+/g, "-").slice(0, 40) || "board"}-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  // ------------------------------------------------------------ keyboard (trainer)
  useEffect(() => {
    if (!isHost) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable)) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) room.redo();
        else room.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        room.redo();
        return;
      }
      if (mod || e.altKey) return;
      const tools: Record<string, ToolType> = {
        "1": "fountain-pen",
        "2": "sketch-pencil",
        "3": "ballpoint",
        "4": "marker-highlighter",
        "5": "eraser",
        "6": "laser-pointer",
        h: "hand-pan",
        H: "hand-pan",
      };
      if (tools[e.key]) setCurrentTool(tools[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isHost, room]);

  // ------------------------------------------------------------ gates
  if (room.joinError?.full) {
    return <ClassroomQueueGate roomId={roomId} roomName={roomName} onAdmitted={room.retryJoin} onLeave={onLeave} />;
  }
  if (room.joinError) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-sm w-full rounded-2xl bg-[#0f0f0f] border border-emerald-950/40 p-6 text-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="text-sm text-gray-300">{room.joinError.message}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={onLeave} className="px-4 py-2 rounded-xl bg-zinc-800 text-gray-200 text-xs font-semibold">
              Back to café
            </button>
            <button onClick={room.retryJoin} className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BoardReadOnlyContext.Provider value={!isHost}>
      <div className="fixed inset-0 z-[70] flex flex-col bg-[#fdfbf7] text-neutral-900">
        <RoomTopBar
          roomName={roomName}
          isHost={isHost}
          connected={room.joined && room.boardLoaded}
          participants={room.participants}
          canUndo={room.canUndo}
          canRedo={room.canRedo}
          onUndo={room.undo}
          onRedo={room.redo}
          onClear={room.clearBoard}
          onAddCard={handleAddCard}
          zoom={viewport.zoom}
          onZoomIn={() => zoomBy(1.2)}
          onZoomOut={() => zoomBy(1 / 1.2)}
          onFit={fitContent}
          onDownload={downloadBoard}
          sharingScreen={room.sharingScreen}
          onToggleScreenShare={() => (room.sharingScreen ? room.stopScreenShare() : room.startScreenShare())}
          micOn={room.micOn}
          canSpeak={room.canSpeak}
          onToggleMic={room.toggleMic}
          handRaised={room.handRaised}
          onToggleHand={room.toggleHand}
          panelOpen={panelOpen}
          unread={unread}
          onTogglePanel={() => setPanelOpen((o) => !o)}
          onLeave={onLeave}
        />

        <div ref={stageRef} className="relative flex-1 overflow-hidden">
          <WhiteboardCanvas
            currentTool={currentTool}
            currentColor={currentColor}
            strokeSize={strokeSize}
            paperTexture={room.board.texture}
            strokes={room.board.strokes}
            cards={cards}
            viewport={viewport}
            onViewportChange={setViewport}
            onStrokeCommit={room.commitStroke}
            onStrokeStream={room.streamStroke}
            onStrokesDelete={room.deleteStrokes}
            onCardUpdate={handleCardUpdate}
            onCardDelete={handleCardDelete}
            onInsertImage={isHost ? handleInsertImage : undefined}
            remoteUsers={room.trainerCursors}
            onCursorMove={room.sendCursor}
            onPressureChange={setLivePressure}
            remoteStreamingStrokes={room.remoteStreamingStrokes}
            isReadOnly={!isHost}
            onStudentDrawAttempt={() => showToast("Only the trainer writes on the board — raise your hand or use the chat.")}
            localUserId={user?.id}
            onStopScreenShare={room.stopScreenShare}
          />

          {isHost && (
            <ToolBar
              currentTool={currentTool}
              onSelectTool={setCurrentTool}
              currentColor={currentColor}
              onSelectColor={setCurrentColor}
              strokeSize={strokeSize}
              onSelectSize={setStrokeSize}
              paperTexture={room.board.texture}
              onSelectPaperTexture={room.setTexture}
              livePressure={livePressure}
            />
          )}

          {!room.boardLoaded && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#fdfbf7]/80">
              {room.boardError ? (
                <div className="max-w-sm text-center space-y-3 p-6 rounded-2xl bg-white shadow-xl border border-neutral-200">
                  <AlertTriangle className="w-7 h-7 text-amber-500 mx-auto" />
                  <p className="text-sm text-neutral-700">{room.boardError}</p>
                  <button
                    onClick={() => room.retryBoard()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Try again
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading the board…
                </div>
              )}
            </div>
          )}

          {room.boardLoaded && !isHost && room.board.strokes.length === 0 && room.board.cards.length === 0 && !screenCard && (
            <div className="absolute inset-x-0 top-10 z-10 flex justify-center pointer-events-none">
              <div className="px-4 py-2 rounded-full bg-white/90 border border-neutral-200 shadow-sm text-xs text-neutral-500">
                The board is empty — your trainer&apos;s writing will appear here live.
              </div>
            </div>
          )}

          {toast && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-50 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs shadow-xl max-w-[90%] text-center">
              {toast}
            </div>
          )}

          <RoomSidePanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            roomId={roomId}
            isHost={isHost}
            myId={user?.id}
            chat={room.chat}
            onSend={room.sendChat}
            participants={room.participants}
            onAllowSpeak={room.allowToSpeak}
            onRevokeSpeak={room.revokeSpeak}
            onDismissHand={room.dismissHand}
          />
        </div>

        {isHost && (
          <InsertImageModal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} onInsert={(src, title, w, h) => handleInsertImage(src, title, w, h)} />
        )}

        {!room.joined && room.boardLoaded && (
          <div className="absolute bottom-3 left-3 z-50 text-[11px] text-neutral-500 bg-white/90 border border-neutral-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" /> Connecting voice…
          </div>
        )}

        <button
          onClick={onLeave}
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-1 focus:rounded"
        >
          <ArrowLeft className="w-4 h-4 inline" /> Leave room
        </button>
      </div>
    </BoardReadOnlyContext.Provider>
  );
}
