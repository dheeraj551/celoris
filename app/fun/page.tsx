import { Metadata } from "next"
import { Gamepad2, Trophy, Users, Star, TrendingUp, Play, MessageCircle, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Fun - Celoris Platform",
  description: "Enjoy engaging games, connect with community, and climb the leaderboards. Take a break and have fun while learning.",
  openGraph: {
    title: "Fun - Celoris Platform",
    description: "Enjoy engaging games and connect with our community.",
    url: "https://celoris.com/fun",
  },
}

const games = [
  {
    id: 1,
    title: "Memory Match Challenge",
    description: "Test your memory with this classic card matching game. Improve your concentration and cognitive skills.",
    category: "Puzzle",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 15420,
    rating: 4.8,
    isMultiplayer: false,
    gameType: "browser"
  },
  {
    id: 2,
    title: "Code Quiz Battle",
    description: "Challenge your programming knowledge in this fast-paced quiz game. Perfect for developers.",
    category: "Educational",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 8930,
    rating: 4.9,
    isMultiplayer: true,
    gameType: "browser"
  },
  {
    id: 3,
    title: "Word Puzzle Master",
    description: "Expand your vocabulary with challenging word puzzles. Available in multiple languages.",
    category: "Word",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 12450,
    rating: 4.7,
    isMultiplayer: true,
    gameType: "browser"
  },
  {
    id: 4,
    title: "Math Speed Challenge",
    description: "Solve mathematical problems against the clock. Improve your mental math skills.",
    category: "Educational",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 6780,
    rating: 4.6,
    isMultiplayer: true,
    gameType: "browser"
  },
  {
    id: 5,
    title: "Strategy Simulator",
    description: "Build and manage your virtual empire in this strategic simulation game.",
    category: "Strategy",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 5430,
    rating: 4.8,
    isMultiplayer: true,
    gameType: "webgl"
  },
  {
    id: 6,
    title: "Quick Draw Challenge",
    description: "Test your drawing skills and creativity in this fun sketching game.",
    category: "Creative",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 9870,
    rating: 4.5,
    isMultiplayer: false,
    gameType: "browser"
  }
]

const gameCategories = [
  { name: "Puzzle", count: 12, icon: "🧩" },
  { name: "Educational", count: 18, icon: "📚" },
  { name: "Word", count: 8, icon: "📝" },
  { name: "Strategy", count: 6, icon: "🎯" },
  { name: "Creative", count: 10, icon: "🎨" },
  { name: "Action", count: 9, icon: "⚡" },
  { name: "Sports", count: 7, icon: "⚽" },
  { name: "Racing", count: 5, icon: "🏎️" }
]

const communityPosts = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    title: "Just completed the Memory Match Challenge!",
    content: "Managed to beat my personal best score of 1,250 points. This game really helps with concentration!",
    category: "Achievement",
    likes: 24,
    comments: 8,
    timeAgo: "2 hours ago",
    tags: ["memory", "challenge", "personal-best"]
  },
  {
    id: 2,
    author: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    title: "Tips for Code Quiz Battle newcomers",
    content: "For those starting out, focus on JavaScript basics first. The game gets progressively harder, so build a solid foundation.",
    category: "Tips",
    likes: 18,
    comments: 12,
    timeAgo: "5 hours ago",
    tags: ["tips", "javascript", "beginners"]
  },
  {
    id: 3,
    author: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    title: "New game suggestions thread",
    content: "Would love to see more strategy games added! Maybe something with AI opponents?",
    category: "Suggestion",
    likes: 15,
    comments: 6,
    timeAgo: "1 day ago",
    tags: ["suggestions", "strategy", "ai"]
  }
]

const leaderboard = [
  {
    rank: 1,
    user: "Alex Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    totalScore: 15420,
    badges: ["memory-master", "quiz-champion", "word-wizard"]
  },
  {
    rank: 2,
    user: "Jessica Park",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    totalScore: 13890,
    badges: ["code-crusher", "math-whiz"]
  },
  {
    rank: 3,
    user: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    totalScore: 12650,
    badges: ["strategy-sage", "creative-genius"]
  },
  {
    rank: 4,
    user: "Lisa Wang",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    totalScore: 11400,
    badges: ["puzzle-pro"]
  },
  {
    rank: 5,
    user: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    totalScore: 10890,
    badges: ["speed-demon"]
  }
]

export default function FunPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Play, Connect, Compete
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-50">
            Take a break from learning and earning to have some fun! Enjoy engaging games, 
            connect with the community, and climb the leaderboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100" asChild>
              <Link href="/fun/games">
                Play Games
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-500" asChild>
              <Link href="/fun/community">
                Join Community
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">75+</div>
              <div className="text-text-secondary">Games Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">100K+</div>
              <div className="text-text-secondary">Games Played</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">25K+</div>
              <div className="text-text-secondary">Active Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">50+</div>
              <div className="text-text-secondary">Community Posts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Game Categories
            </h2>
            <p className="text-lg text-text-secondary">
              Find your favorite type of game
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gameCategories.map((category) => (
              <Card key={category.name} className="card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-text-primary mb-2">{category.name}</h3>
                  <p className="text-sm text-text-secondary">{category.count} games</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Featured Games
              </h2>
              <p className="text-lg text-text-secondary">
                Popular games loved by our community
              </p>
            </div>
            <Button asChild>
              <Link href="/fun/games">
                View All Games
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <Card key={game.id} className="card-hover">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {game.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {game.difficulty}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100">
                      <Play className="mr-2 h-5 w-5" />
                      Play Now
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-text-secondary">{game.rating}</span>
                      <span className="text-sm text-text-secondary">({game.playCount.toLocaleString()} plays)</span>
                    </div>
                    {game.isMultiplayer && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        Multiplayer
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{game.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>
                  <Button className="w-full" asChild>
                    <Link href={`/fun/games/${game.id}`}>
                      <Play className="mr-2 h-4 w-4" />
                      Play Game
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/fun/games">
                Explore All Games
                <Gamepad2 className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Global Leaderboard
            </h2>
            <p className="text-lg text-text-secondary">
              Top players across all games and challenges
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                  Top Players This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboard.map((player) => (
                  <div key={player.rank} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                        #{player.rank}
                      </div>
                    </div>
                    <img
                      src={player.avatar}
                      alt={player.user}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">{player.user}</div>
                      <div className="text-sm text-text-secondary">
                        Total Score: {player.totalScore.toLocaleString()}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {player.badges.map((badge) => (
                          <span
                            key={badge}
                            className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs"
                          >
                            {badge.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    {player.rank <= 3 && (
                      <div className="text-2xl">
                        {player.rank === 1 && '🥇'}
                        {player.rank === 2 && '🥈'}
                        {player.rank === 3 && '🥉'}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/fun/leaderboard">
                  View Full Leaderboard
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Feed */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Community Feed
              </h2>
              <p className="text-lg text-text-secondary">
                Latest posts from fellow players
              </p>
            </div>
            <Button asChild>
              <Link href="/fun/community">
                Join Discussion
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {communityPosts.map((post) => (
              <Card key={post.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-text-primary">{post.author}</span>
                        <span className="text-text-secondary">•</span>
                        <span className="text-sm text-text-secondary">{post.timeAgo}</span>
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-text-primary mb-2">{post.title}</h3>
                      <p className="text-text-secondary mb-3">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-text-secondary px-2 py-1 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <button className="flex items-center space-x-1 hover:text-primary-500">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-primary-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/fun/community">
                View More Posts
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}