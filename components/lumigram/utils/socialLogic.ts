import { Post, User, Comment, ReportCategory, ReportItem, NotificationItem, IngestionMetrics } from '../types';

/**
 * Format numbers in social media style (e.g. 1.4M, 24.5K)
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 10_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toLocaleString();
}

/**
 * Format timestamp into relative social media format (e.g. 2m, 4h, 3d)
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w`;
}

/**
 * Pure state transition for toggling like on a post
 */
export function togglePostLike(post: Post): Post {
  const isLiked = !post.isLiked;
  const likesCount = isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
  return {
    ...post,
    isLiked,
    likesCount,
  };
}

/**
 * Pure state transition for toggling bookmark / save on a post
 */
export function togglePostSave(post: Post): Post {
  return {
    ...post,
    isSaved: !post.isSaved,
  };
}

/**
 * Pure state transition for adding a comment
 */
export function addPostComment(post: Post, author: User, text: string): { updatedPost: Post; newComment: Comment } {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Comment text cannot be empty');
  }

  const newComment: Comment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    postId: post.id,
    user: author,
    text: trimmed,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    isLiked: false,
  };

  const updatedPost: Post = {
    ...post,
    commentsCount: post.commentsCount + 1,
    comments: [newComment, ...post.comments],
  };

  return { updatedPost, newComment };
}

/**
 * Handle Follow / Unfollow / Request Follow for private accounts
 */
export function toggleUserFollow(
  target: User,
  actor: User
): {
  updatedTarget: User;
  updatedActor: User;
  action: 'followed' | 'unfollowed' | 'requested' | 'unrequested';
} {
  // If already following, unfollow
  if (target.isFollowing) {
    return {
      updatedTarget: {
        ...target,
        isFollowing: false,
        followersCount: Math.max(0, target.followersCount - 1),
      },
      updatedActor: {
        ...actor,
        followingCount: Math.max(0, actor.followingCount - 1),
      },
      action: 'unfollowed',
    };
  }

  // If already requested follow on private account, cancel request
  if (target.hasRequestedFollow) {
    return {
      updatedTarget: {
        ...target,
        hasRequestedFollow: false,
      },
      updatedActor: actor,
      action: 'unrequested',
    };
  }

  // If private account, set requested state
  if (target.isPrivate) {
    return {
      updatedTarget: {
        ...target,
        hasRequestedFollow: true,
      },
      updatedActor: actor,
      action: 'requested',
    };
  }

  // Normal public follow
  return {
    updatedTarget: {
      ...target,
      isFollowing: true,
      followersCount: target.followersCount + 1,
    },
    updatedActor: {
      ...actor,
      followingCount: actor.followingCount + 1,
    },
    action: 'followed',
  };
}

/**
 * Filter posts in Explore / Search tab by query (text, tags, user) and category
 */
export function filterExplorePosts(posts: Post[], query: string, category: string): Post[] {
  const cleanQuery = query.trim().toLowerCase();
  const isAllCategory = !category || category.toLowerCase() === 'for you' || category.toLowerCase() === 'all';

  return posts.filter((post) => {
    // Category match
    if (!isAllCategory) {
      const catMatch = post.tags.some((t) => t.toLowerCase() === category.toLowerCase()) ||
        post.caption.toLowerCase().includes(category.toLowerCase());
      if (!catMatch) return false;
    }

    // Query match
    if (!cleanQuery) return true;

    const inUsername = post.user.username.toLowerCase().includes(cleanQuery);
    const inName = post.user.name.toLowerCase().includes(cleanQuery);
    const inCaption = post.caption.toLowerCase().includes(cleanQuery);
    const inLocation = post.location?.toLowerCase().includes(cleanQuery) || false;
    const inTags = post.tags.some((t) => t.toLowerCase().includes(cleanQuery.replace('#', '')));

    return inUsername || inName || inCaption || inLocation || inTags;
  });
}

/**
 * Create a validated report record
 */
export function createReportRecord(
  reporter: User,
  targetId: string,
  targetUser: User,
  itemType: 'post' | 'user' | 'message',
  category: ReportCategory,
  details: string
): ReportItem {
  if (!details || details.trim().length < 5) {
    throw new Error('Please provide at least 5 characters of context for safety review');
  }

  return {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    reportedItemId: targetId,
    itemType,
    reportedUser: targetUser,
    category,
    details: details.trim(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
}

/**
 * Compute simulated live scalable cloud metrics for millions of concurrent uploads
 */
export function calculateScalableMetrics(seedFactor = 1): IngestionMetrics {
  // Base realistic distributed metrics at social media scale
  const baseUploads = 142850 + Math.floor(Math.sin(Date.now() / 8000) * 12500 * seedFactor);
  const throughput = Math.floor(baseUploads * 0.85); // ~120 MB/s to 150 MB/s
  const latency = +(14.2 + Math.abs(Math.cos(Date.now() / 5000)) * 6.5).toFixed(1);
  const cacheHit = +(99.3 + Math.abs(Math.sin(Date.now() / 12000)) * 0.5).toFixed(2);
  const processed = 18_420_910 + Math.floor((Date.now() % 100000) / 10);

  return {
    concurrentUploads: baseUploads,
    ingestThroughputMBps: throughput,
    edgeLatencyMs: latency,
    cacheHitRatio: Math.min(99.9, cacheHit),
    activeShards: 256,
    queuedTasks: Math.floor(180 + Math.sin(Date.now() / 3000) * 60),
    processedImagesToday: processed,
  };
}
