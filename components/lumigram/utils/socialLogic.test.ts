import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCount,
  formatTimeAgo,
  togglePostLike,
  togglePostSave,
  addPostComment,
  toggleUserFollow,
  filterExplorePosts,
  createReportRecord,
  calculateScalableMetrics,
} from './socialLogic';
import { Post, User } from '../types';

const mockUser: User = {
  id: 'u_1',
  username: 'alex_creator',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio: 'Visual storyteller',
  followersCount: 12400,
  followingCount: 420,
  postsCount: 54,
  isFollowing: false,
};

const mockPost: Post = {
  id: 'p_1',
  userId: 'u_1',
  user: mockUser,
  images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
  caption: 'Golden hour reflections in the valley #nature #photography #travel',
  likesCount: 1500,
  isLiked: false,
  isSaved: false,
  commentsCount: 2,
  comments: [],
  createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  tags: ['nature', 'photography', 'travel'],
};

test('formatCount formats standard, thousands, and millions correctly', () => {
  assert.equal(formatCount(420), '420');
  assert.equal(formatCount(12500), '12.5K');
  assert.equal(formatCount(2400000), '2.4M');
});

test('formatTimeAgo converts timestamps to relative format', () => {
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
  assert.equal(formatTimeAgo(oneHourAgo), '1h');

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600000).toISOString();
  assert.equal(formatTimeAgo(twoDaysAgo), '2d');
});

test('togglePostLike increments and decrements likes count reliably', () => {
  const liked = togglePostLike(mockPost);
  assert.equal(liked.isLiked, true);
  assert.equal(liked.likesCount, 1501);

  const unliked = togglePostLike(liked);
  assert.equal(unliked.isLiked, false);
  assert.equal(unliked.likesCount, 1500);
});

test('togglePostSave toggles isSaved flag', () => {
  const saved = togglePostSave(mockPost);
  assert.equal(saved.isSaved, true);
  const unsaved = togglePostSave(saved);
  assert.equal(unsaved.isSaved, false);
});

test('addPostComment adds a comment and updates count', () => {
  const { updatedPost, newComment } = addPostComment(mockPost, mockUser, 'Stunning capture!');
  assert.equal(updatedPost.commentsCount, 3);
  assert.equal(updatedPost.comments.length, 1);
  assert.equal(newComment.text, 'Stunning capture!');
  assert.equal(newComment.user.username, 'alex_creator');

  assert.throws(() => {
    addPostComment(mockPost, mockUser, '   ');
  }, /cannot be empty/);
});

test('toggleUserFollow handles public accounts and private accounts', () => {
  const actor: User = { ...mockUser, id: 'u_actor', followingCount: 10 };
  const targetPublic: User = { ...mockUser, id: 'u_target', isFollowing: false, followersCount: 100, isPrivate: false };

  // Follow public
  const r1 = toggleUserFollow(targetPublic, actor);
  assert.equal(r1.action, 'followed');
  assert.equal(r1.updatedTarget.isFollowing, true);
  assert.equal(r1.updatedTarget.followersCount, 101);
  assert.equal(r1.updatedActor.followingCount, 11);

  // Unfollow public
  const r2 = toggleUserFollow(r1.updatedTarget, r1.updatedActor);
  assert.equal(r2.action, 'unfollowed');
  assert.equal(r2.updatedTarget.isFollowing, false);
  assert.equal(r2.updatedTarget.followersCount, 100);

  // Follow private account
  const targetPrivate: User = { ...mockUser, id: 'u_priv', isFollowing: false, isPrivate: true, hasRequestedFollow: false };
  const r3 = toggleUserFollow(targetPrivate, actor);
  assert.equal(r3.action, 'requested');
  assert.equal(r3.updatedTarget.hasRequestedFollow, true);
});

test('filterExplorePosts filters by tags and search query', () => {
  const posts = [
    mockPost,
    {
      ...mockPost,
      id: 'p_2',
      caption: 'Delicious handmade pasta in Rome #food #pasta',
      tags: ['food', 'pasta'],
      user: { ...mockUser, username: 'chef_mario' },
    },
  ];

  const travelResults = filterExplorePosts(posts, 'travel', 'all');
  assert.equal(travelResults.length, 1);
  assert.equal(travelResults[0].id, 'p_1');

  const foodCategoryResults = filterExplorePosts(posts, '', 'food');
  assert.equal(foodCategoryResults.length, 1);
  assert.equal(foodCategoryResults[0].id, 'p_2');
});

test('createReportRecord validates details context and formats record', () => {
  const report = createReportRecord(mockUser, 'p_1', mockUser, 'post', 'spam', 'Repeated unwanted commercial links');
  assert.equal(report.reportedItemId, 'p_1');
  assert.equal(report.category, 'spam');
  assert.equal(report.status, 'pending');

  assert.throws(() => {
    createReportRecord(mockUser, 'p_1', mockUser, 'post', 'spam', 'bad');
  }, /at least 5 characters/);
});

test('calculateScalableMetrics returns valid ingestion telemetry', () => {
  const metrics = calculateScalableMetrics();
  assert.ok(metrics.concurrentUploads > 100000);
  assert.ok(metrics.edgeLatencyMs > 0);
  assert.ok(metrics.cacheHitRatio >= 99);
  assert.equal(metrics.activeShards, 256);
});
