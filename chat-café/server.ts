import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  ChatMessage,
  UserProfile,
  CafeTable,
  DiscussionTopic,
  ModerationReport,
  ModerationActionLog,
  GuestbookEntry,
} from './src/types';
import { CAFE_TABLES, SEED_TOPICS, CAFE_DRINKS } from './src/data/cafeData';
import { SEED_GUESTBOOK_ENTRIES } from './src/data/seedGuestbook';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// Server State
const connectedClients = new Map<WebSocket, UserProfile>();
let messages: ChatMessage[] = [];
let tables: CafeTable[] = JSON.parse(JSON.stringify(CAFE_TABLES));
let reports: ModerationReport[] = [];
let moderationLogs: ModerationActionLog[] = [];
const bannedUserIds = new Set<string>();
const mutedUsers = new Map<string, number>(); // userId -> expiration timestamp
const userLastMessageTime = new Map<string, number>(); // userId -> timestamp for slow mode

// Durable Guestbook Storage (Permanent & Non-Expiring)
const GUESTBOOK_FILE = path.join(process.cwd(), 'src', 'data', 'guestbook.json');
let guestbookEntries: GuestbookEntry[] = [];

try {
  if (fs.existsSync(GUESTBOOK_FILE)) {
    const raw = fs.readFileSync(GUESTBOOK_FILE, 'utf-8');
    guestbookEntries = JSON.parse(raw);
    if (!Array.isArray(guestbookEntries) || guestbookEntries.length === 0) {
      guestbookEntries = JSON.parse(JSON.stringify(SEED_GUESTBOOK_ENTRIES));
      fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(guestbookEntries, null, 2), 'utf-8');
    }
  } else {
    guestbookEntries = JSON.parse(JSON.stringify(SEED_GUESTBOOK_ENTRIES));
    fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(guestbookEntries, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Could not read or write guestbook file, fallback to seed entries:', e);
  guestbookEntries = JSON.parse(JSON.stringify(SEED_GUESTBOOK_ENTRIES));
}

const saveGuestbook = () => {
  try {
    fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(guestbookEntries, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save guestbook entries:', e);
  }
};

// Attach initial discussion topic to main lounge
tables[0].activeTopic = SEED_TOPICS[0];
tables[1].activeTopic = SEED_TOPICS[1];
tables[2].activeTopic = SEED_TOPICS[2];

// Seed welcoming messages so the cafe feels alive and inviting right from turn 1
const seedPatrons: UserProfile[] = [
  {
    id: 'patron_nora',
    name: 'Barista Nora',
    avatarId: 'cat_barista',
    avatarColor: 'from-amber-400 to-orange-500',
    accessory: 'Apron & Whisk',
    role: 'barista',
    statusText: 'Brewing fresh pour-overs ☕',
    currentDrink: 'Velvet Vanilla Latte',
    bubbleStyle: 'latte',
    joinedAt: Date.now() - 3600000,
  },
  {
    id: 'patron_oliver',
    name: 'Oliver Vance',
    avatarId: 'fox_books',
    avatarColor: 'from-orange-400 to-amber-600',
    accessory: 'Horn-rim Glasses',
    role: 'moderator',
    statusText: 'Re-reading Calvino 📖',
    currentDrink: 'Lavender Cold Brew',
    bubbleStyle: 'parchment',
    joinedAt: Date.now() - 3000000,
  },
  {
    id: 'patron_maya',
    name: 'Maya Lin',
    avatarId: 'rabbit_matcha',
    avatarColor: 'from-emerald-400 to-teal-600',
    accessory: 'Tea Flower',
    role: 'regular',
    statusText: 'Sketching cafe patrons 🎨',
    currentDrink: 'Ceremonial Matcha Latte',
    bubbleStyle: 'matcha',
    joinedAt: Date.now() - 2000000,
  },
  {
    id: 'patron_julian',
    name: 'Julian Chen',
    avatarId: 'bear_cozy',
    avatarColor: 'from-amber-700 to-yellow-800',
    accessory: 'Knit Beanie',
    role: 'patron',
    statusText: 'Writing code & soaking vibes 🎧',
    currentDrink: 'Dark Roast Espresso',
    bubbleStyle: 'espresso',
    joinedAt: Date.now() - 1200000,
  },
];

messages = [
  {
    id: 'msg_seed_1',
    tableId: 'main_lounge',
    sender: seedPatrons[0],
    content: 'Welcome in to Celoris Cafe, friends! 🍂 Take off your coat, pull up a comfy chair, and let the lofi music settle your thoughts. What are you sipping today?',
    timestamp: Date.now() - 1000 * 60 * 18,
    reactions: { '☕': ['patron_oliver', 'patron_maya'], '✨': ['patron_julian'] },
    isPinned: true,
  },
  {
    id: 'msg_seed_2',
    tableId: 'main_lounge',
    sender: seedPatrons[1],
    content: 'A gentle reminder that our guided table discussion is running on the header above: "Small Rituals That Save Our Sanity". Everyone is invited to jump in and share!',
    timestamp: Date.now() - 1000 * 60 * 14,
    reactions: { '👏': ['patron_nora', 'patron_maya'] },
  },
  {
    id: 'msg_seed_3',
    tableId: 'main_lounge',
    sender: seedPatrons[2],
    content: 'For me, it is ten minutes of total silence with hot matcha before opening email. The world can wait until the first cup is done.',
    timestamp: Date.now() - 1000 * 60 * 9,
    reactions: { '🍵': ['patron_nora', 'patron_oliver', 'patron_julian'] },
  },
  {
    id: 'msg_seed_4',
    tableId: 'main_lounge',
    sender: seedPatrons[0],
    content: 'Ordered a round of warm cinnamon buns for the table! Enjoy everyone 🥐✨',
    timestamp: Date.now() - 1000 * 60 * 4,
    reactions: { '🥐': ['patron_julian', 'patron_maya', 'patron_oliver'] },
    drinkGift: {
      drink: CAFE_DRINKS[8],
      recipientName: 'The Entire Celoris Cafe',
      note: 'Fresh from our ovens!',
    },
  },
  {
    id: 'msg_seed_5',
    tableId: 'main_lounge',
    sender: seedPatrons[3],
    content: 'Nothing beats good coffee and thoughtful company. Loving the autumn seasonal warmth in here!',
    timestamp: Date.now() - 1000 * 60 * 1,
    reactions: { '☕': ['patron_nora'] },
  },
];

// Setup Gemini AI Client (Server-side only)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });

function broadcast(event: string, data: any) {
  const payload = JSON.stringify({ event, data });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function broadcastToRole(roles: string[], event: string, data: any) {
  const payload = JSON.stringify({ event, data });
  connectedClients.forEach((profile, client) => {
    if (roles.includes(profile.role) && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function getActivePatrons(): UserProfile[] {
  const map = new Map<string, UserProfile>();
  connectedClients.forEach((profile) => {
    if (profile && profile.id) {
      map.set(profile.id, profile);
    }
  });
  // Add seed active patrons if not already represented so room stays lively
  seedPatrons.forEach((sp) => {
    if (!map.has(sp.id)) {
      map.set(sp.id, sp);
    }
  });
  return Array.from(map.values());
}

wss.on('connection', (ws: WebSocket) => {
  let currentUser: UserProfile | null = null;

  ws.on('message', (raw: string) => {
    try {
      const msg = JSON.parse(raw.toString());
      const { type, data } = msg;

      if (type === 'join') {
        const user: UserProfile = data.user;
        if (!user || !user.id) return;

        if (bannedUserIds.has(user.id)) {
          ws.send(JSON.stringify({ event: 'banned', data: { reason: 'You have been barred from Chat Café.' } }));
          ws.close();
          return;
        }

        // Clean up any stale sockets associated with this user id
        connectedClients.forEach((profile, client) => {
          if (profile.id === user.id && client !== ws) {
            connectedClients.delete(client);
          }
        });

        currentUser = user;
        connectedClients.set(ws, user);

        // Send full state to joining user
        ws.send(JSON.stringify({
          event: 'init_sync',
          data: {
            messages,
            tables,
            activePatrons: getActivePatrons(),
            reports: (user.role === 'moderator' || user.role === 'admin') ? reports : [],
            bannedUserIds: Array.from(bannedUserIds),
            mutedUntil: mutedUsers.get(user.id) || 0,
            guestbookEntries,
          },
        }));

        // Broadcast presence update
        broadcast('patron:joined', {
          user,
          activePatrons: getActivePatrons(),
        });
      }

      if (type === 'chat_message') {
        if (!currentUser) return;

        // Check ban
        if (bannedUserIds.has(currentUser.id)) {
          ws.send(JSON.stringify({ event: 'error', data: { message: 'You are banned from sending messages.' } }));
          return;
        }

        // Check mute
        const muteExp = mutedUsers.get(currentUser.id);
        if (muteExp && muteExp > Date.now()) {
          const remainingSec = Math.ceil((muteExp - Date.now()) / 1000);
          ws.send(JSON.stringify({ event: 'error', data: { message: `You are temporarily muted for ${remainingSec}s.` } }));
          return;
        }

        // Check slow mode
        const targetTable = tables.find((t) => t.id === data.tableId);
        const slowMode = targetTable?.slowModeSeconds || 0;
        if (slowMode > 0 && currentUser.role !== 'moderator' && currentUser.role !== 'admin') {
          const lastMsg = userLastMessageTime.get(currentUser.id) || 0;
          const diff = Math.floor((Date.now() - lastMsg) / 1000);
          if (diff < slowMode) {
            ws.send(JSON.stringify({
              event: 'error',
              data: { message: `Slow mode active: please wait ${slowMode - diff}s before sending another message.` },
            }));
            return;
          }
        }

        userLastMessageTime.set(currentUser.id, Date.now());

        // Basic profanity / slur filter for safe cafe vibe
        const content: string = data.content || '';
        const forbiddenWords = ['fuck', 'bitch', 'asshole', 'bastard', 'nigger', 'faggot', 'retard', 'cunt'];
        let moderatedContent = content;
        let flagged = false;
        forbiddenWords.forEach((word) => {
          const reg = new RegExp(`\\b${word}\\b`, 'gi');
          if (reg.test(moderatedContent)) {
            moderatedContent = moderatedContent.replace(reg, '☕***');
            flagged = true;
          }
        });

        const newMsg: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          tableId: data.tableId || 'main_lounge',
          sender: currentUser,
          content: moderatedContent,
          timestamp: Date.now(),
          replyTo: data.replyTo,
          reactions: {},
          isPinned: false,
          drinkGift: data.drinkGift,
        };

        messages.push(newMsg);
        if (messages.length > 300) {
          messages.shift();
        }

        broadcast('message:created', newMsg);

        // If automated filter caught severe words, trigger a moderation notice
        if (flagged) {
          const autoReport: ModerationReport = {
            id: `rep_${Date.now()}`,
            messageId: newMsg.id,
            messagePreview: content.slice(0, 80),
            reportedUserId: currentUser.id,
            reportedUserName: currentUser.name,
            reportedBy: 'AI Auto-Filter Guard',
            reason: 'inappropriate',
            note: 'Automated profanity match replaced with cafe censor.',
            timestamp: Date.now(),
            status: 'pending',
          };
          reports.unshift(autoReport);
          broadcastToRole(['moderator', 'admin'], 'report:new', autoReport);
        }
      }

      if (type === 'reaction') {
        const { messageId, emoji, userId } = data;
        const target = messages.find((m) => m.id === messageId);
        if (target) {
          if (!target.reactions[emoji]) {
            target.reactions[emoji] = [];
          }
          const userIdx = target.reactions[emoji].indexOf(userId);
          if (userIdx >= 0) {
            target.reactions[emoji].splice(userIdx, 1);
            if (target.reactions[emoji].length === 0) {
              delete target.reactions[emoji];
            }
          } else {
            target.reactions[emoji].push(userId);
          }
          broadcast('message:updated', target);
        }
      }

      if (type === 'typing') {
        broadcast('patron:typing', {
          user: currentUser,
          tableId: data.tableId,
          isTyping: !!data.isTyping,
        });
      }

      // MODERATION ACTIONS
      if (type === 'mod_delete_message') {
        if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'admin')) {
          ws.send(JSON.stringify({ event: 'error', data: { message: 'Moderator permissions required.' } }));
          return;
        }
        const { messageId, reason } = data;
        const target = messages.find((m) => m.id === messageId);
        if (target) {
          target.isDeleted = true;
          target.deletionReason = reason || 'Removed by moderator';
          target.deletedBy = currentUser.name;
          broadcast('message:updated', target);

          moderationLogs.unshift({
            id: `log_${Date.now()}`,
            action: 'delete',
            targetMessageId: messageId,
            moderatorName: currentUser.name,
            reason: reason || 'Violation of café etiquette',
            timestamp: Date.now(),
          });
        }
      }

      if (type === 'mod_pin_message') {
        if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'admin')) return;
        const { messageId } = data;
        const target = messages.find((m) => m.id === messageId);
        if (target) {
          target.isPinned = !target.isPinned;
          broadcast('message:updated', target);
        }
      }

      if (type === 'mod_mute_user') {
        if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'admin')) return;
        const { targetUserId, targetUserName, durationMinutes, reason } = data;
        const expiration = Date.now() + (durationMinutes || 10) * 60 * 1000;
        mutedUsers.set(targetUserId, expiration);

        broadcast('user:muted', {
          targetUserId,
          targetUserName,
          expiration,
          reason,
          moderatorName: currentUser.name,
        });
      }

      if (type === 'mod_unmute_user') {
        if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'admin')) return;
        const { targetUserId } = data;
        mutedUsers.delete(targetUserId);
        broadcast('user:unmuted', { targetUserId });
      }

      if (type === 'mod_ban_user') {
        if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'admin')) return;
        const { targetUserId, targetUserName, reason } = data;
        bannedUserIds.add(targetUserId);

        // Terminate any active socket for this user
        connectedClients.forEach((profile, client) => {
          if (profile.id === targetUserId) {
            client.send(JSON.stringify({ event: 'banned', data: { reason } }));
            client.close();
          }
        });

        broadcast('user:banned', {
          targetUserId,
          targetUserName,
          reason,
          moderatorName: currentUser.name,
        });
      }

      if (type === 'mod_unban_user') {
        if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'admin')) return;
        const { targetUserId } = data;
        bannedUserIds.delete(targetUserId);
        broadcast('user:unbanned', { targetUserId });
      }

      if (type === 'report_message') {
        const { messageId, reason, note } = data;
        const targetMsg = messages.find((m) => m.id === messageId);
        if (targetMsg && currentUser) {
          const report: ModerationReport = {
            id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            messageId,
            messagePreview: targetMsg.content.slice(0, 100),
            reportedUserId: targetMsg.sender.id,
            reportedUserName: targetMsg.sender.name,
            reportedBy: currentUser.name,
            reason,
            note,
            timestamp: Date.now(),
            status: 'pending',
          };
          reports.unshift(report);
          broadcastToRole(['moderator', 'admin'], 'report:new', report);
          ws.send(JSON.stringify({ event: 'report:received', data: { reportId: report.id } }));
        }
      }

      if (type === 'mod_resolve_report') {
        if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'admin')) return;
        const { reportId, status } = data;
        const rep = reports.find((r) => r.id === reportId);
        if (rep) {
          rep.status = status;
          broadcastToRole(['moderator', 'admin'], 'report:updated', rep);
        }
      }

      if (type === 'mod_set_slowmode') {
        if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'admin')) return;
        const { tableId, seconds } = data;
        const table = tables.find((t) => t.id === tableId);
        if (table) {
          table.slowModeSeconds = seconds;
          broadcast('table:updated', table);
        }
      }

      if (type === 'set_topic') {
        const { tableId, topic } = data;
        const table = tables.find((t) => t.id === tableId);
        if (table) {
          table.activeTopic = topic;
          broadcast('table:updated', table);

          // Also publish an announcement message in the table
          const topicMsg: ChatMessage = {
            id: `msg_topic_${Date.now()}`,
            tableId,
            sender: {
              id: 'system_host',
              name: 'Café Discussion Host',
              avatarId: 'owl_philosophy',
              avatarColor: 'from-amber-600 to-yellow-700',
              accessory: 'Wool Scarf',
              role: 'barista',
              statusText: 'Guiding the round table 🎙️',
              currentDrink: 'Spiced Cardamom Chai',
              bubbleStyle: 'parchment',
              joinedAt: Date.now(),
            },
            content: `📢 New Guided Discussion: "${topic.title}" — ${topic.prompt}`,
            timestamp: Date.now(),
            reactions: { '💡': [] },
            isPinned: true,
            isDiscussionTopic: true,
            discussionData: {
              title: topic.title,
              category: topic.category,
              starterPrompts: topic.starterQuestions,
            },
          };
          messages.push(topicMsg);
          broadcast('message:created', topicMsg);
        }
      }

      if (type === 'sign_guestbook') {
        if (!currentUser) return;
        const { message, motto, origin, stamp, plaqueStyle, tableId } = data;
        const trimmed = (message || '').trim();
        if (!trimmed) {
          ws.send(JSON.stringify({ event: 'error', data: { message: 'Guestbook message cannot be blank.' } }));
          return;
        }

        // Basic profanity check
        let cleanMsg = trimmed;
        const forbiddenWords = ['fuck', 'bitch', 'asshole', 'bastard', 'nigger', 'faggot', 'retard', 'cunt'];
        forbiddenWords.forEach((word) => {
          const reg = new RegExp(`\\b${word}\\b`, 'gi');
          cleanMsg = cleanMsg.replace(reg, '☕***');
        });

        const newEntry: GuestbookEntry = {
          id: `gb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          tableId: tableId || 'main_lounge',
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatarId: currentUser.avatarId,
          userAvatarColor: currentUser.avatarColor,
          userRole: currentUser.role,
          message: cleanMsg,
          motto: (motto || '').trim() || undefined,
          origin: (origin || '').trim() || undefined,
          stamp: stamp || 'coffee',
          plaqueStyle: plaqueStyle || 'gold_brass',
          timestamp: Date.now(),
          tributes: { '⭐': [currentUser.id] },
          isFeatured: currentUser.role === 'barista' || currentUser.role === 'moderator' || currentUser.role === 'admin',
        };

        guestbookEntries.unshift(newEntry);
        saveGuestbook();

        // Broadcast to all clients
        broadcast('guestbook:signed', { entry: newEntry, entries: guestbookEntries });

        // Announce in chat
        const announceMsg: ChatMessage = {
          id: `msg_gb_${Date.now()}`,
          tableId: tableId || 'main_lounge',
          sender: {
            id: 'system_guestbook',
            name: 'Wall of Fame Herald',
            avatarId: 'owl_philosophy',
            avatarColor: 'from-amber-500 to-yellow-600',
            accessory: 'Golden Quill',
            role: 'barista',
            statusText: 'Keeper of Permanent Plaques 📜',
            currentDrink: 'Velvet Vanilla Latte',
            bubbleStyle: 'parchment',
            joinedAt: Date.now(),
          },
          content: `📜 [Wall of Fame] ${currentUser.name} has etched a permanent plaque on the Wall of Fame: "${cleanMsg.slice(0, 60)}${cleanMsg.length > 60 ? '...' : ''}"`,
          timestamp: Date.now(),
          reactions: { '⭐': [currentUser.id] },
        };
        messages.push(announceMsg);
        broadcast('message:created', announceMsg);
      }

      if (type === 'tribute_guestbook') {
        if (!currentUser) return;
        const { entryId, tributeType } = data;
        const entry = guestbookEntries.find((e) => e.id === entryId);
        if (entry) {
          if (!entry.tributes) entry.tributes = {};
          const emoji = tributeType || '⭐';
          if (!entry.tributes[emoji]) {
            entry.tributes[emoji] = [];
          }
          const userIdx = entry.tributes[emoji].indexOf(currentUser.id);
          if (userIdx >= 0) {
            entry.tributes[emoji].splice(userIdx, 1);
          } else {
            entry.tributes[emoji].push(currentUser.id);
          }
          saveGuestbook();
          broadcast('guestbook:updated', { entry, entries: guestbookEntries });
        }
      }

      if (type === 'update_profile') {
        if (!currentUser) return;
        currentUser.name = data.name || currentUser.name;
        currentUser.avatarId = data.avatarId || currentUser.avatarId;
        currentUser.avatarColor = data.avatarColor || currentUser.avatarColor;
        currentUser.accessory = data.accessory || currentUser.accessory;
        currentUser.statusText = data.statusText || currentUser.statusText;
        currentUser.currentDrink = data.currentDrink || currentUser.currentDrink;
        currentUser.bubbleStyle = data.bubbleStyle || currentUser.bubbleStyle;
        currentUser.role = data.role || currentUser.role;

        connectedClients.set(ws, currentUser);
        broadcast('patron:updated', {
          user: currentUser,
          activePatrons: getActivePatrons(),
        });
      }
    } catch (e) {
      console.error('Socket message parse error:', e);
    }
  });

  ws.on('close', () => {
    if (currentUser) {
      connectedClients.delete(ws);
      broadcast('patron:left', {
        userId: currentUser.id,
        activePatrons: getActivePatrons(),
      });
    }
  });
});

// Upgrade HTTP to WS
server.on('upgrade', (request, socket, head) => {
  const pathname = request.url;
  if (pathname === '/ws' || pathname?.startsWith('/ws')) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', patronsCount: connectedClients.size });
});

app.get('/api/snapshot', (req, res) => {
  res.json({
    tables,
    messages,
    activePatrons: getActivePatrons(),
    reportsCount: reports.filter((r) => r.status === 'pending').length,
    bannedUserIds: Array.from(bannedUserIds),
    guestbookEntries,
  });
});

// Guestbook Permanent API
app.get('/api/guestbook', (req, res) => {
  res.json({ entries: guestbookEntries });
});

app.post('/api/guestbook', (req, res) => {
  const { user, message, motto, origin, stamp, plaqueStyle, tableId } = req.body;
  if (!message || !user) {
    return res.status(400).json({ error: 'User and message required' });
  }

  const cleanMsg = (message || '').trim();
  const newEntry: GuestbookEntry = {
    id: `gb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tableId: tableId || 'main_lounge',
    userId: user.id,
    userName: user.name,
    userAvatarId: user.avatarId,
    userAvatarColor: user.avatarColor,
    userRole: user.role || 'patron',
    message: cleanMsg,
    motto: motto?.trim() || undefined,
    origin: origin?.trim() || undefined,
    stamp: stamp || 'coffee',
    plaqueStyle: plaqueStyle || 'gold_brass',
    timestamp: Date.now(),
    tributes: { '⭐': [user.id] },
    isFeatured: user.role === 'barista' || user.role === 'moderator' || user.role === 'admin',
  };

  guestbookEntries.unshift(newEntry);
  saveGuestbook();

  broadcast('guestbook:signed', { entry: newEntry, entries: guestbookEntries });
  res.json({ success: true, entry: newEntry });
});

app.post('/api/guestbook/:id/tribute', (req, res) => {
  const { id } = req.params;
  const { userId, tributeType } = req.body;
  const entry = guestbookEntries.find((e) => e.id === id);
  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  const emoji = tributeType || '⭐';
  if (!entry.tributes) entry.tributes = {};
  if (!entry.tributes[emoji]) entry.tributes[emoji] = [];
  const idx = entry.tributes[emoji].indexOf(userId);
  if (idx >= 0) {
    entry.tributes[emoji].splice(idx, 1);
  } else {
    entry.tributes[emoji].push(userId);
  }
  saveGuestbook();
  broadcast('guestbook:updated', { entry, entries: guestbookEntries });
  res.json({ success: true, entry });
});

// Gemini API: Generate Guided Discussion Topic
app.post('/api/cafe/discussion-prompt', async (req, res) => {
  const { category, mood } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Graceful fallback to rich curated cafe topics if key not configured
    const randomSeed = SEED_TOPICS[Math.floor(Math.random() * SEED_TOPICS.length)];
    return res.json({
      topic: {
        id: `topic_${Date.now()}`,
        title: `${randomSeed.title} (Curated)`,
        prompt: randomSeed.prompt,
        category: category || randomSeed.category,
        starterQuestions: randomSeed.starterQuestions,
        hostedBy: 'Café Barista Host',
        startedAt: Date.now(),
        phase: 'open_floor',
      },
    });
  }

  try {
    const prompt = `You are the thoughtful host and barista of "Chat Café", a warm, public cozy café where patrons gather to meet new friends, reflect, and share meaningful conversation.
Generate a brand new, engaging, and welcoming guided discussion topic for the cafe patrons.
Category requested: "${category || 'Any insightful topic'}"
Mood / Vibe: "${mood || 'Cozy, thought-provoking, and accessible to everyone'}"

Return ONLY valid JSON matching this schema:
{
  "title": "A warm catchy 4-7 word title",
  "prompt": "A friendly 1-2 sentence core discussion prompt that encourages personal stories or gentle reflections",
  "category": "The category name",
  "starterQuestions": [
    "A quick gentle icebreaker question",
    "A deeper personal reflection question",
    "A forward-looking or creative question"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const topic: DiscussionTopic = {
      id: `topic_${Date.now()}`,
      title: parsed.title || 'Midday Musings & Quiet Curiosities',
      prompt: parsed.prompt || 'What is something you recently rediscovered that brought you unexpected joy?',
      category: parsed.category || category || 'General Cafe Chat',
      starterQuestions: parsed.starterQuestions || [
        'How did you first stumble upon it?',
        'Who is someone you would share this joy with?',
      ],
      hostedBy: 'Barista AI Host',
      startedAt: Date.now(),
      phase: 'open_floor',
    };

    res.json({ topic });
  } catch (err) {
    console.error('Gemini discussion-prompt error:', err);
    // Fallback topic
    res.json({
      topic: {
        id: `topic_${Date.now()}`,
        title: 'Unwritten Rules of Cozy Spaces',
        prompt: 'What subtle design or human habits make a space instantly feel like a sanctuary?',
        category: category || 'Atmosphere & Design',
        starterQuestions: [
          'Is it lighting, music, acoustics, or company?',
          'What is your favorite quiet corner in your daily life?',
        ],
        hostedBy: 'Barista Nora',
        startedAt: Date.now(),
        phase: 'open_floor',
      },
    });
  }
});

// Gemini API: Ask Barista Assistant
app.post('/api/cafe/barista-ask', async (req, res) => {
  const { question, userContext } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      reply: "Nora here! While our AI steamer is warming up, I always recommend a fresh cardamom latte and taking three slow breaths before your next adventure. Welcome to Chat Café!",
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are Barista Nora, the friendly, witty, and warmly hospitable head barista at Chat Café.
Patron asks: "${question}"
Patron context: ${JSON.stringify(userContext || {})}

Respond in 2-3 cozy, welcoming sentences with café metaphors, warmth, and friendly encouragement.`,
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error('Gemini barista-ask error:', err);
    res.json({
      reply: 'A warm welcome to Chat Café! Whatever brings you through our door today, take your time and enjoy the calm.',
    });
  }
});

// Gemini API: AI Content Moderation Audit
app.post('/api/cafe/ai-moderate', async (req, res) => {
  const { messageContent } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      safe: true,
      analysis: 'Manual moderation active (offline filter cleared).',
      recommendation: 'allow',
    });
  }

  try {
    const prompt = `Analyze this message sent in a family-friendly, cozy public chat room called Chat Café:
"${messageContent}"

Evaluate whether it contains harassment, hate speech, severe toxicity, spam, or blatant hostility.
Respond ONLY with JSON:
{
  "safe": boolean,
  "flagSeverity": "none" | "low" | "medium" | "high",
  "reason": "short explanation",
  "recommendation": "allow" | "warn" | "delete" | "mute"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err) {
    console.error('AI Moderation error:', err);
    res.json({ safe: true, analysis: 'Unable to evaluate with AI, use human review.', recommendation: 'allow' });
  }
});

// Vite middleware for dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`☕ Chat Café server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
