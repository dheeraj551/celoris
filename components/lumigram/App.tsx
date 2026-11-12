"use client"
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CURRENT_USER,
  SEED_USERS,
  SEED_POSTS,
  SEED_STORIES,
  SEED_CONVERSATIONS,
  SEED_NOTIFICATIONS,
  INITIAL_ACCOUNT_SETTINGS,
} from './data/seedData';
import {
  Post,
  User,
  UserStory,
  Conversation,
  NotificationItem,
  AccountSettings,
  ThemeMode,
  ReportItem,
  ActiveCampaign,
} from './types';
import {
  togglePostLike,
  togglePostSave,
  addPostComment,
  toggleUserFollow,
} from './utils/socialLogic';
import { generateCreatorReply, generateContextualComment } from './utils/aiSocialEngine';
import { soundManager } from './utils/sound';
import { Rocket, CheckCircle2, X, BarChart2, Coins, TrendingUp, Zap, ChevronDown, Edit3, Image as ImageIcon, Smile, Hash, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

import { Navigation } from './components/Navigation';
import { StoriesBar } from './components/StoriesBar';
import { StoryViewerModal } from './components/StoryViewerModal';
import { PostCard } from './components/PostCard';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';
import { DirectMessages } from './components/DirectMessages';
import { ActivityFeed } from './components/ActivityFeed';
import { ExploreTab } from './components/ExploreTab';
import { ProfileView } from './components/ProfileView';
import { ReportModal } from './components/ReportModal';
import { SettingsModal } from './components/SettingsModal';
import { RightSidebar } from './components/RightSidebar';
import { PushNotificationToast } from './components/PushNotificationToast';
import { EditProfileModal } from './components/EditProfileModal';

export default function App() {
  // Celoris User Management & Wallet sync
  const { user: authUser, profile, refreshProfile } = useAuth();

  // Pro plan detection (checks /api/account/plan + profile roles/subscriptions)
  const [planTier, setPlanTier] = useState<'free' | 'basic' | 'pro' | 'max'>('free');
  useEffect(() => {
    let active = true;
    fetch('/api/account/plan', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.plan?.tier) {
          setPlanTier(data.plan.tier);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [authUser?.id]);

  const isProUser = Boolean(
    planTier === 'pro' ||
      planTier === 'max' ||
      profile?.subscription_status === 'premium' ||
      profile?.subscription_status === 'enterprise' ||
      profile?.subscription_status === 'pro' ||
      profile?.subscription_status === 'max' ||
      profile?.is_pro === true ||
      profile?.is_premium === true ||
      profile?.plan === 'pro' ||
      profile?.plan === 'max' ||
      profile?.role === 'admin' ||
      profile?.role === 'superadmin'
  );

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Core domain state
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [usersMap, setUsersMap] = useState<Record<string, User>>(SEED_USERS);
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [stories, setStories] = useState<UserStory[]>(SEED_STORIES);
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [reportsHistory, setReportsHistory] = useState<ReportItem[]>([]);
  const [accountSettings, setAccountSettings] = useState<AccountSettings>(INITIAL_ACCOUNT_SETTINGS);
  const [typingPostIds, setTypingPostIds] = useState<Record<string, boolean>>({});
  const [isLiveAutomationActive, setIsLiveAutomationActive] = useState<boolean>(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'messages' | 'activity' | 'profile' | 'ads'>('feed');
  const [selectedProfileUser, setSelectedProfileUser] = useState<User>(CURRENT_USER);

  // Ad Studio Campaign state
  const [walletBalance, setWalletBalance] = useState<number>(10000);
  const [campaigns, setCampaigns] = useState<ActiveCampaign[]>([
    {
      id: 'camp-1',
      postId: 'post_dheeraj_1',
      postTitle: 'Stop spending ₹15,000 on basic reels',
      objective: 'WhatsApp Leads',
      dailyBudget: 500,
      spent: 500,
      status: 'Active',
      impressions: 5410,
      clicks: 148,
      cpc: '₹6.40',
      ctr: '2.73%',
      leads: 19,
    },
  ]);
  const [boostingPost, setBoostingPost] = useState<Post | null>(null);
  const [boostBudget, setBoostBudget] = useState<number>(500);
  const [boostObjective, setBoostObjective] = useState<'leads' | 'traffic'>('leads');
  const [selectedCities, setSelectedCities] = useState<string[]>(['Delhi NCR', 'Mumbai', 'Jaipur']);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  // Media & Content Protection: Disable right-click context menu and drag-to-copy
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Synchronize authenticated Celoris student profile & real wallet
  useEffect(() => {
    if (authUser) {
      const metadataName = (authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || '').trim();
      const isGenericRole = ['tutor', 'user', 'student', 'admin', 'instructor'].includes((profile?.name || '').trim().toLowerCase());

      const savedCustomName = typeof window !== 'undefined' ? localStorage.getItem('celoris_pulse_name') : null;
      const savedCustomUsername = typeof window !== 'undefined' ? localStorage.getItem('celoris_pulse_username') : null;

      const realName = savedCustomName
        || (profile?.full_name && profile.full_name.trim())
        || (!isGenericRole && profile?.name && profile.name.trim())
        || metadataName
        || 'Ananya Jairath';

      let realUsername = savedCustomUsername;
      if (!realUsername) {
        if (profile?.username && profile.username.trim().length > 2 && profile.username !== 'any') {
          realUsername = profile.username.toLowerCase().replace(/[^a-z0-9_]/g, '');
        } else if (metadataName) {
          realUsername = metadataName.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        } else if (realName && !isGenericRole) {
          realUsername = realName.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        } else {
          realUsername = (profile?.email || authUser.email || 'student').split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
        }
      }

      const realAvatar = profile?.avatar_url || profile?.profile_pic_url || authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || CURRENT_USER.avatar;
      const realUser: User = {
        id: authUser.id,
        name: realName,
        username: realUsername || 'ananya_jairath',
        avatar: realAvatar,
        bio: profile?.bio || 'Performance Marketing Student @ Celoris',
        website: profile?.website || 'https://celorisdesigns.com',
        isVerified: profile?.role === 'admin' || profile?.role === 'instructor' || profile?.role === 'tutor',
        followersCount: 142,
        followingCount: 38,
        postsCount: 1,
        role: profile?.role || 'Creator & Student',
      };
      setCurrentUser(realUser);
      setSelectedProfileUser(realUser);

      if (profile?.wallet_balance !== undefined && profile?.wallet_balance !== null) {
        setWalletBalance(Number(profile.wallet_balance));
      }
    }
  }, [authUser, profile]);

  // Fetch real posts and active campaigns from Supabase database
  useEffect(() => {
    const fetchLiveSocial = async () => {
      try {
        const res = await fetch('/api/social/posts');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.posts) && data.posts.length > 0) {
            // Merge with SEED_POSTS so instructors/mentors remain visible
            const combined = [...data.posts, ...SEED_POSTS.filter((s) => !data.posts.some((p: any) => p.id === s.id))];
            setPosts(combined);
          }
          if (Array.isArray(data.campaigns) && data.campaigns.length > 0) {
            const mappedCampaigns: ActiveCampaign[] = data.campaigns.map((c: any) => ({
              id: c.id,
              postId: c.post_id || 'post_1',
              postTitle: c.post_title || 'Active Campaign',
              objective: c.objective || 'WhatsApp Leads',
              dailyBudget: Number(c.daily_budget) || 500,
              spent: Number(c.spent) || 500,
              status: c.status || 'Active',
              impressions: c.impressions || 1200,
              clicks: c.clicks || 35,
              cpc: '₹6.50',
              ctr: '2.8%',
              leads: c.leads || 4,
            }));
            setCampaigns(mappedCampaigns);
          }
        }
      } catch (err) {
        console.warn('Could not load live social posts:', err);
      }
    };
    fetchLiveSocial();
  }, []);

  // Update wallet helper
  const updateWallet = (val: number) => {
    setWalletBalance(val);
    try {
      localStorage.setItem('celoris_social_wallet', String(val));
    } catch {}
  };

  // Active modals
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState<Post | null>(null);
  const [selectedDetailPost, setSelectedDetailPost] = useState<Post | null>(null);
  const [activePushToast, setActivePushToast] = useState<NotificationItem | null>(null);

  // Apply dark/light class to html document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fetch real community users (zero synthetic AI users) for Who to Follow & Stories
  const [communityUsers, setCommunityUsers] = useState<User[]>([]);
  const [feedSearchQuery, setFeedSearchQuery] = useState<string>('');

  // Inline rich composer state
  const [composerText, setComposerText] = useState('');
  const [composerMediaUrl, setComposerMediaUrl] = useState<string | null>(null);
  const [composerMediaFile, setComposerMediaFile] = useState<File | null>(null);
  const [composerIsVideo, setComposerIsVideo] = useState(false);
  const [composerAspectRatio, setComposerAspectRatio] = useState<'square' | 'portrait' | 'landscape' | 'vertical'>('square');
  const [isPublishingInline, setIsPublishingInline] = useState(false);
  const composerFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/social/community-users', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data?.users) || data.users.length === 0) return;
        const realUsers: User[] = data.users;
        setCommunityUsers(realUsers);

        // Merge into usersMap
        setUsersMap((prev) => {
          const next = { ...prev };
          for (const u of realUsers) {
            next[u.id] = u;
          }
          return next;
        });

        // Build real community stories from active users (first 8 real creators with avatars)
        const realStories: UserStory[] = realUsers.slice(0, 8).map((u, idx) => ({
          userId: u.id,
          user: u,
          hasUnseen: idx < 4,
          updatedAt: new Date(Date.now() - (idx + 1) * 25 * 60 * 1000).toISOString(),
          slides: [
            {
              id: `story_real_${u.id}`,
              mediaUrl: u.avatar,
              type: 'image',
              durationSeconds: 5,
              caption: `${u.name} · ${u.bio || 'Sharing updates on Celoris'}`,
            },
          ],
        }));
        setStories(realStories);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Admin-approved real users for community simulation
  const [simulationUsers, setSimulationUsers] = useState<Array<{
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio: string;
    isVerified?: boolean;
  }>>([]);

  useEffect(() => {
    if (!isProUser) return;
    let active = true;
    fetch('/api/social/simulation-users', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.users)) {
          setSimulationUsers(data.users);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isProUser]);

  // Autonomous Live Community Simulator (strictly uses ONLY admin-approved real users)
  const triggerInstantAiEngagement = () => {
    if (!posts || posts.length === 0) return;

    const optedInPool = simulationUsers.filter(
      (u) => u.id !== authUser?.id && u.id !== currentUser.id
    );
    if (optedInPool.length === 0) return; // No fallback dummy AI users

    const targetIdx = Math.floor(Math.random() * Math.min(4, posts.length));
    const target = posts[targetIdx];
    if (!target) return;

    const member = optedInPool[Math.floor(Math.random() * optedInPool.length)];
    const commentText = generateContextualComment(target);

    const actorUser: User = {
      id: member.id,
      username: member.username,
      name: member.name,
      avatar: member.avatar,
      bio: member.bio || 'Celoris Community Creator',
      isVerified: Boolean(member.isVerified),
      followersCount: 142,
      followingCount: 45,
      postsCount: 5,
      isOnline: true,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === target.id) {
          const { updatedPost } = addPostComment(p, actorUser, commentText);
          const withLikes = {
            ...updatedPost,
            likesCount: updatedPost.likesCount + Math.floor(Math.random() * 3 + 1),
          };
          if (selectedDetailPost && selectedDetailPost.id === target.id) {
            setSelectedDetailPost(withLikes);
          }
          return withLikes;
        }
        return p;
      })
    );

    soundManager.playNotificationSound();

    const liveNotif: NotificationItem = {
      id: `live_auto_${Date.now()}`,
      type: 'comment',
      actor: actorUser,
      targetPost: target,
      text: `commented: "${commentText}"`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setActivePushToast(liveNotif);
    setNotifications((prev) => [liveNotif, ...prev]);

    setTimeout(() => {
      setActivePushToast((curr) => (curr?.id === liveNotif.id ? null : curr));
    }, 4500);
  };

  const handleInlineFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setComposerMediaFile(file);
    const isVid = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v)$/i.test(file.name);
    setComposerIsVideo(isVid);
    if (isVid) {
      setComposerAspectRatio('vertical');
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const url = reader.result;
        setComposerMediaUrl(url);
        if (!isVid) {
          const img = new Image();
          img.onload = () => {
            const ratio = img.width / (img.height || 1);
            if (ratio > 1.2) setComposerAspectRatio('landscape');
            else if (ratio < 0.7) setComposerAspectRatio('vertical');
            else if (ratio < 0.95) setComposerAspectRatio('portrait');
            else setComposerAspectRatio('square');
          };
          img.src = url;
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInlinePublish = async () => {
    if (!composerText.trim() && !composerMediaUrl) return;
    setIsPublishingInline(true);
    let finalMediaUrl = composerMediaUrl || '';
    try {
      if (composerMediaFile) {
        const formData = new FormData();
        formData.append('file', composerMediaFile);
        const uploadRes = await fetch('/api/social/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.url) {
          finalMediaUrl = uploadData.url;
        }
      }

      const tags = composerText
        .split(/\s+/)
        .filter((w) => w.startsWith('#'))
        .map((w) => w.replace('#', '').toLowerCase());

      let createdPostId = `post_${Date.now()}`;
      try {
        const postRes = await fetch('/api/social/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caption: composerText.trim(),
            media_url: finalMediaUrl || undefined,
            media_type: composerIsVideo ? 'video' : 'image',
            tags: tags.length ? tags : ['celoris'],
            aspect_ratio: composerAspectRatio,
            user_name: currentUser.name,
            user_username: currentUser.username,
            user_avatar: currentUser.avatar,
          }),
        });
        const postData = await postRes.json();
        if (postRes.ok && postData.post?.id) {
          createdPostId = postData.post.id;
        }
      } catch {}

      const newPost: Post = {
        id: createdPostId,
        userId: currentUser.id,
        user: currentUser,
        images: finalMediaUrl ? [finalMediaUrl] : [],
        mediaType: composerIsVideo ? 'video' : 'image',
        caption: composerText.trim(),
        aspectRatio: composerAspectRatio,
        likesCount: 0,
        isLiked: false,
        isSaved: false,
        commentsCount: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        tags: tags.length ? tags : ['celoris'],
      };

      setPosts((prev) => [newPost, ...prev]);
      setComposerText('');
      setComposerMediaUrl(null);
      setComposerMediaFile(null);
      setComposerIsVideo(false);
      soundManager.playSendSound();
    } finally {
      setIsPublishingInline(false);
    }
  };

  useEffect(() => {
    if (!isProUser || !isLiveAutomationActive) return;

    const interval = setInterval(() => {
      triggerInstantAiEngagement();
    }, 60000);

    return () => clearInterval(interval);
  }, [isProUser, isLiveAutomationActive, posts, simulationUsers]);

  // Handlers
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = togglePostLike(p);
          if (selectedDetailPost && selectedDetailPost.id === postId) {
            setSelectedDetailPost(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = togglePostSave(p);
          if (selectedDetailPost && selectedDetailPost.id === postId) {
            setSelectedDetailPost(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    soundManager.playSendSound();

    let targetPostForReply: Post | undefined;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const { updatedPost } = addPostComment(p, currentUser, text);
          targetPostForReply = updatedPost;
          if (selectedDetailPost && selectedDetailPost.id === postId) {
            setSelectedDetailPost(updatedPost);
          }
          return updatedPost;
        }
        return p;
      })
    );

    // Trigger AI Creator Auto-Response (Pro Users Only)
    if (isProUser && targetPostForReply) {
      const creatorUser = targetPostForReply.user;
      setTypingPostIds((prev) => ({ ...prev, [postId]: true }));

      setTimeout(() => {
        setTypingPostIds((prev) => ({ ...prev, [postId]: false }));

        if (!targetPostForReply) return;
        const replyText = generateCreatorReply(targetPostForReply, text, currentUser);

        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === postId) {
              const { updatedPost } = addPostComment(p, creatorUser, replyText);
              if (selectedDetailPost && selectedDetailPost.id === postId) {
                setSelectedDetailPost(updatedPost);
              }
              return updatedPost;
            }
            return p;
          })
        );

        soundManager.playPopSound();

        // Push In-App Notification and Toast
        const replyNotification: NotificationItem = {
          id: `ai_reply_${Date.now()}`,
          type: 'comment',
          actor: creatorUser,
          targetPost: targetPostForReply,
          text: `replied to your comment: "${replyText}"`,
          createdAt: new Date().toISOString(),
          isRead: false,
        };

        setActivePushToast(replyNotification);
        setNotifications((prev) => [replyNotification, ...prev]);

        setTimeout(() => {
          setActivePushToast((curr) => (curr?.id === replyNotification.id ? null : curr));
        }, 5000);
      }, 1250);
    }
  };

  const handleToggleFollow = (targetUser: User) => {
    const { updatedTarget, updatedActor, action } = toggleUserFollow(targetUser, currentUser);
    setCurrentUser(updatedActor);

    // Update usersMap and communityUsers
    setUsersMap((prev) => ({
      ...prev,
      [updatedTarget.id]: updatedTarget,
    }));
    setCommunityUsers((prev) =>
      prev.map((u) => (u.id === updatedTarget.id ? updatedTarget : u))
    );

    // Update posts created by that user
    setPosts((prev) =>
      prev.map((p) => {
        if (p.userId === updatedTarget.id) {
          return { ...p, user: updatedTarget };
        }
        return p;
      })
    );

    // Update selected profile if viewing that user
    if (selectedProfileUser.id === updatedTarget.id) {
      setSelectedProfileUser(updatedTarget);
    }

    // Add activity notification
    if (action === 'followed') {
      const followNotif: NotificationItem = {
        id: `notif_fol_${Date.now()}`,
        type: 'follow',
        actor: updatedTarget,
        text: 'started following you back',
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [followNotif, ...prev]);
    }
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      postsCount: prev.postsCount + 1,
    }));

    // Trigger push toast
    if (accountSettings.pushNotifications.enabled) {
      const push: NotificationItem = {
        id: `notif_post_${Date.now()}`,
        type: 'mention',
        actor: currentUser,
        text: 'Your post is now live on Celoris Pulse!',
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setActivePushToast(push);
      setTimeout(() => {
        setActivePushToast((c) => (c?.id === push.id ? null : c));
      }, 5000);
    }
  };

  const handleSendMessage = (conversationId: string, text: string, imageUrl?: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            lastMessage: {
              ...c.lastMessage,
              text: text || 'Shared photo',
              imageUrl,
              createdAt: new Date().toISOString(),
            },
          };
        }
        return c;
      })
    );
  };

  const handleSubmitReport = (report: ReportItem) => {
    setReportsHistory((prev) => [report, ...prev]);
  };

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleLaunchBoost = async () => {
    if (!boostingPost) return;
    if (walletBalance < boostBudget) {
      alert(`Insufficient wallet credits! Your balance is ₹${walletBalance.toLocaleString('en-IN')}, but this campaign requires ₹${boostBudget.toLocaleString('en-IN')}. Please add credits in your Celoris account.`);
      return;
    }
    setIsSimulating(true);
    try {
      const res = await fetch('/api/social/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: boostingPost.id,
          postTitle: boostingPost.hook || boostingPost.caption.slice(0, 35) + '...',
          budget: boostBudget,
          objective: boostObjective,
          targetCities: selectedCities,
          userId: currentUser.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to amplify campaign');
        return;
      }

      if (data.newBalance !== undefined) {
        updateWallet(data.newBalance);
        if (refreshProfile) {
          try {
            await refreshProfile({ wallet_balance: data.newBalance });
          } catch {}
        }
      }

      const campaignData = data.campaign;

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === boostingPost.id) {
            return {
              ...p,
              isSponsored: true,
              sponsorData: {
                buttonText: boostObjective === 'leads' ? 'Send Message' : 'Learn More',
                destination: '/learn/course/digital-marketing-mastery',
                impressions: campaignData?.impressions || 3600,
                clicks: campaignData?.clicks || 84,
                cpc: '₹6.40',
                ctr: '2.7%',
                leads: campaignData?.leads || 9,
                dailyBudget: boostBudget,
              },
            };
          }
          return p;
        })
      );

      const newCampaign: ActiveCampaign = {
        id: campaignData?.id || `camp-${Date.now()}`,
        postId: boostingPost.id,
        postTitle: boostingPost.hook || boostingPost.caption.slice(0, 35) + '...',
        objective: boostObjective === 'leads' ? 'WhatsApp Leads' : 'Traffic',
        dailyBudget: boostBudget,
        spent: boostBudget,
        status: 'Active',
        impressions: campaignData?.impressions || 3600,
        clicks: campaignData?.clicks || 84,
        cpc: '₹6.40',
        ctr: '2.7%',
        leads: campaignData?.leads || 9,
      };
      setCampaigns((prev) => [newCampaign, ...prev]);
      setBoostingPost(null);
      soundManager.playSendSound();
    } catch (err: any) {
      console.error(err);
      alert('Amplification failed: ' + (err?.message || 'Please try again.'));
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedProfileUser(user);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStorySeen = (userId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.userId === userId ? { ...s, hasUnseen: false } : s))
    );
  };

  const savedPosts = posts.filter((p) => p.isSaved);
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const suggestedUsers = (communityUsers.length > 0 ? communityUsers : Object.values(usersMap)).filter(
    (u) => u.id !== currentUser.id
  );
  const filteredFeedPosts = feedSearchQuery.trim()
    ? posts.filter((p) => {
        const q = feedSearchQuery.toLowerCase();
        return (
          (p.caption || '').toLowerCase().includes(q) ||
          (p.user?.username || '').toLowerCase().includes(q) ||
          (p.user?.name || '').toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      })
    : posts;

  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row transition-colors select-none ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Floating Push Notification Toast */}
      <PushNotificationToast
        notification={activePushToast}
        onDismiss={() => setActivePushToast(null)}
        onClick={() => {
          setActiveTab('activity');
          setActivePushToast(null);
        }}
      />

      {/* Main Navigation Sidebar (Desktop) + Mobile Top & Bottom Nav */}
      <Navigation
        activeTab={activeTab}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        currentUser={currentUser}
        theme={theme}
        walletBalance={walletBalance}
        isProUser={isProUser}
        onSelectTab={(tab) => {
          if (tab === 'profile') {
            setSelectedProfileUser(currentUser);
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={handleToggleTheme}
      />

      {/* Content Center Viewport */}
      <main className="flex-1 flex justify-center px-3 sm:px-6 py-4 md:py-6 pb-20 md:pb-8 min-w-0">
        <div
          className={`w-full ${
            activeTab === 'messages' || activeTab === 'explore' || activeTab === 'profile' || activeTab === 'ads'
              ? 'max-w-4xl'
              : 'max-w-xl lg:max-w-2xl'
          }`}
        >
          {/* TAB: HOME FEED */}
          {activeTab === 'feed' && (
            <div>
              {/* Header Greeting matching Reference Screenshot */}
              <div className="flex items-center justify-between pb-3 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                      Hello, {currentUser.name ? currentUser.name.split(' ')[0].toLowerCase() : currentUser.username} 👋
                    </h1>
                    <ChevronDown size={18} className="text-neutral-400" />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Your creative network is active with {unreadNotificationsCount + posts.length} new updates
                  </p>
                </div>
                {feedSearchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => setFeedSearchQuery('')}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Filter: {feedSearchQuery}</span>
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Stories Carousel */}
              <StoriesBar
                stories={stories}
                currentUser={currentUser}
                onSelectStory={(idx) => setActiveStoryIndex(idx)}
                onOpenCreateStory={() => setIsCreateOpen(true)}
              />

              {/* Rich Inline Composer Card matching Reference Screenshot */}
              <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 mb-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-neutral-200 dark:ring-neutral-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        Everyone can reply
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
                        title="Open full media & filter studio"
                      >
                        <Edit3 size={12} />
                        <span>Studio Modal</span>
                      </button>
                    </div>

                    <textarea
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value.slice(0, 280))}
                      placeholder="What's happening in your studio? ✨"
                      rows={composerText.length > 65 ? 3 : 2}
                      className="w-full resize-none bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none leading-relaxed"
                    />

                    {/* Inline Media Preview */}
                    {composerMediaUrl && (
                      <div className="relative mt-2 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                        <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold">
                          High-Res Preview
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setComposerMediaUrl(null);
                            setComposerMediaFile(null);
                            setComposerIsVideo(false);
                          }}
                          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer"
                          aria-label="Remove media"
                        >
                          <X size={14} />
                        </button>
                        {composerIsVideo ? (
                          <video src={composerMediaUrl} controls className="w-full max-h-72 object-contain bg-black" />
                        ) : (
                          <img src={composerMediaUrl} alt="Upload preview" className="w-full h-auto max-h-80 object-contain mx-auto" />
                        )}
                      </div>
                    )}

                    {/* Composer Toolbar */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <input
                          ref={composerFileRef}
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={handleInlineFilePick}
                        />
                        <button
                          type="button"
                          onClick={() => composerFileRef.current?.click()}
                          className="p-2 rounded-full text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                          title="Upload Photo or Video"
                        >
                          <ImageIcon size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setComposerText((t) => (t + ' ✨').slice(0, 280))}
                          className="p-2 rounded-full text-neutral-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
                          title="Add sparkle emoji"
                        >
                          <Smile size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setComposerText((t) => (t + ' #Celoris').slice(0, 280))}
                          className="p-2 rounded-full text-neutral-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                          title="Add hashtag"
                        >
                          <Hash size={18} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-neutral-400">
                          {composerText.length} / 280
                        </span>
                        <button
                          type="button"
                          disabled={isPublishingInline || (!composerText.trim() && !composerMediaUrl)}
                          onClick={handleInlinePublish}
                          className="px-4 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          {isPublishingInline && <Loader2 size={12} className="animate-spin" />}
                          <span>{isPublishingInline ? 'Publishing...' : 'Publish'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Community Simulator Status Bar (Pro Users Only) */}
              {isProUser && (
                <div className="mb-4 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs shadow-md animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Live Community Simulator</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                          isLiveAutomationActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isLiveAutomationActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                          {isLiveAutomationActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {simulationUsers.length > 0
                          ? `${simulationUsers.length} admin-approved community profiles active in simulation`
                          : 'Toggle users ON in Admin User Management to activate simulation'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={simulationUsers.length === 0}
                      onClick={triggerInstantAiEngagement}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-neutral-950 font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <Zap size={12} />
                      <span>Auto-Engage Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLiveAutomationActive(!isLiveAutomationActive)}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      {isLiveAutomationActive ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>
              )}

              {/* Feed Stream */}
              <div className="space-y-5">
                {filteredFeedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onToggleLike={handleToggleLike}
                    onToggleSave={handleToggleSave}
                    onAddComment={handleAddComment}
                    onOpenReport={(p) => setReportingPost(p)}
                    onOpenShareModal={(p) => {
                      soundManager.playSendSound();
                      setActiveTab('messages');
                    }}
                    onSelectUser={handleSelectUser}
                    onBoostPost={isProUser ? (p) => setBoostingPost(p) : undefined}
                    onOpenComments={(p) => setSelectedDetailPost(p)}
                    isAiTyping={Boolean(typingPostIds[post.id])}
                    isProUser={isProUser}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB: AD STUDIO (Pro Users Only) */}
          {activeTab === 'ads' && isProUser && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <BarChart2 className="text-emerald-500" />
                    <span>Ad Studio</span>
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    A Celoris Social Cloud · Real-time Campaign Engine
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateWallet(10000);
                    alert('Wallet reset to ₹10,000 credits!');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Reset ₹10k Credits
                </button>
              </div>

              {/* Wallet Overview Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-neutral-100 dark:via-neutral-900 to-teal-500/10 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
                      Available Virtual Credits
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      ₹{walletBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
                      Active Campaigns
                    </span>
                    <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                      {campaigns.filter((c) => c.status === 'Active').length} Live
                    </span>
                  </div>
                </div>

                {/* 4 Metric KPI Grid */}
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-[10px] font-mono text-neutral-500 block">Total Spent</span>
                    <strong className="text-sm font-mono text-neutral-900 dark:text-white">
                      ₹{campaigns.reduce((a, b) => a + b.spent, 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-[10px] font-mono text-neutral-500 block">Impressions</span>
                    <strong className="text-sm font-mono text-neutral-900 dark:text-white">
                      {campaigns.reduce((a, b) => a + b.impressions, 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-[10px] font-mono text-neutral-500 block">Average CTR</span>
                    <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
                      2.48%
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-[10px] font-mono text-neutral-500 block">WhatsApp Leads</span>
                    <strong className="text-sm font-mono text-amber-500">
                      {campaigns.reduce((a, b) => a + b.leads, 0)} Inquiries
                    </strong>
                  </div>
                </div>
              </div>

              {/* Active Campaigns Table */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                    Simulated Student Campaigns
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('feed')}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    + Amplify a post from feed
                  </button>
                </div>

                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
                            {camp.postTitle}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {camp.objective}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400 flex-wrap">
                          <span>Budget: ₹{camp.dailyBudget}/day</span>
                          <span>•</span>
                          <span>{camp.impressions} Views</span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400">CTR {camp.ctr}</span>
                          <span>•</span>
                          <span>CPC {camp.cpc}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                          {camp.leads} Leads
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EXPLORE & SEARCH */}
          {activeTab === 'explore' && (
            <ExploreTab
              posts={posts}
              onSelectPost={(post) => setSelectedDetailPost(post)}
              onSelectUser={handleSelectUser}
            />
          )}

          {/* TAB: DIRECT MESSAGES */}
          {activeTab === 'messages' && (
            <DirectMessages
              conversations={conversations}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onAddReaction={(id, emoji) => soundManager.playLikeSound()}
              onSelectUser={handleSelectUser}
            />
          )}

          {/* TAB: ACTIVITY & NOTIFICATIONS */}
          {activeTab === 'activity' && (
            <ActivityFeed
              notifications={notifications}
              currentUser={currentUser}
              onFollowToggle={handleToggleFollow}
              onSelectUser={handleSelectUser}
              onSelectPost={(postId) => {
                const target = posts.find((p) => p.id === postId);
                if (target) setSelectedDetailPost(target);
              }}
            />
          )}

          {/* TAB: USER PROFILE */}
          {activeTab === 'profile' && (
            <ProfileView
              user={selectedProfileUser}
              currentUser={currentUser}
              posts={posts}
              savedPosts={savedPosts}
              onToggleFollow={handleToggleFollow}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onEditProfile={() => setIsEditProfileOpen(true)}
              onSelectPost={(p) => setSelectedDetailPost(p)}
            />
          )}
        </div>
      </main>

      {/* Desktop Right Sidebar (Feed recommendations & Ad Studio Boost for Pro) */}
      {activeTab === 'feed' && (
        <RightSidebar
          currentUser={currentUser}
          suggestedUsers={suggestedUsers}
          isProUser={isProUser}
          onToggleFollow={handleToggleFollow}
          onSelectUser={handleSelectUser}
          onSearch={(q) => setFeedSearchQuery(q)}
          onOpenAdStudio={() => setActiveTab('ads')}
          onOpenExplore={() => setActiveTab('explore')}
          onEditProfile={() => setIsEditProfileOpen(true)}
        />
      )}

      {/* MODAL: Fullscreen Story Viewer */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialUserIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onStorySeen={handleStorySeen}
        />
      )}

      {/* MODAL: Create New Post */}
      {isCreateOpen && (
        <CreatePostModal
          currentUser={currentUser}
          onClose={() => setIsCreateOpen(false)}
          onPostCreated={handleCreatePost}
        />
      )}

      {/* MODAL: Post Detail Modal */}
      {selectedDetailPost && (
        <PostDetailModal
          post={selectedDetailPost}
          currentUser={currentUser}
          onClose={() => setSelectedDetailPost(null)}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onAddComment={handleAddComment}
          onOpenReport={(p) => {
            setSelectedDetailPost(null);
            setReportingPost(p);
          }}
          onSelectUser={handleSelectUser}
          isAiTyping={Boolean(selectedDetailPost && typingPostIds[selectedDetailPost.id])}
          isProUser={isProUser}
        />
      )}

      {/* MODAL: Report Content */}
      {reportingPost && (
        <ReportModal
          post={reportingPost}
          currentUser={currentUser}
          onClose={() => setReportingPost(null)}
          onSubmitReport={handleSubmitReport}
        />
      )}

      {/* MODAL: Settings & Privacy */}
      {isSettingsOpen && (
        <SettingsModal
          settings={accountSettings}
          theme={theme}
          reportsHistory={reportsHistory}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={(newSettings) => setAccountSettings(newSettings)}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {/* MODAL: Edit Profile & Nickname */}
      {isEditProfileOpen && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            setSelectedProfileUser(updated);
          }}
        />
      )}

      {/* MODAL: Ad Studio Campaign Booster */}
      {boostingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                    Amplify Post in Ad Studio
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Live Campaign Simulator · Practice with ₹10,000 Credits
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBoostingPost(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Post Preview Strip */}
            <div className="mt-4 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 flex items-center gap-3">
              <img
                src={boostingPost.images[0] || boostingPost.user.avatar}
                alt="Post thumbnail"
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
                  @{boostingPost.user.username}
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                  {boostingPost.caption}
                </p>
              </div>
            </div>

            {/* Step 1: Goal */}
            <div className="mt-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                1. Select Campaign Goal
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBoostObjective('leads')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    boostObjective === 'leads'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    <span>💬 WhatsApp Leads</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    High intent student inquiries
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setBoostObjective('traffic')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    boostObjective === 'traffic'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    <span>🚀 Course / Bio Traffic</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    Clicks to landing page
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Target Audience */}
            <div className="mt-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                2. Target Cities (India)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Jaipur', 'Lucknow'].map((city) => {
                  const isSelected = selectedCities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          if (selectedCities.length > 1) {
                            setSelectedCities(selectedCities.filter((c) => c !== city));
                          }
                        } else {
                          setSelectedCities([...selectedCities, city]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-transparent font-semibold'
                          : 'bg-transparent text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {isSelected ? `✓ ${city}` : `+ ${city}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Daily Budget */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  3. Practice Daily Budget
                </label>
                <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{boostBudget.toLocaleString('en-IN')}/day
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={boostBudget}
                onChange={(e) => setBoostBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                <span>₹100/day</span>
                <span>Wallet: ₹{walletBalance.toLocaleString('en-IN')} available</span>
                <span>₹2,000/day</span>
              </div>
            </div>

            {/* Live Forecast Pill */}
            <div className="mt-5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
              <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                <span>Estimated 24h Campaign Reach</span>
                <span className="font-mono font-bold">~{Math.round(boostBudget * 7.2).toLocaleString()} views</span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                <span>Estimated CTR: 2.1% - 3.2%</span>
                <span>Estimated Inquiries: ~{Math.max(3, Math.round(boostBudget * 0.024))} students</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBoostingPost(null)}
                className="flex-1 py-3 rounded-2xl font-semibold text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSimulating}
                onClick={handleLaunchBoost}
                className="flex-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Launching Campaign Simulation...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Amplify Post (Deduct ₹{boostBudget})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

