# Celoris Unified Platform

A comprehensive digital ecosystem that brings Learn, Earn, and Fun into a single cohesive platform built with Next.js 14 and Supabase.

![Celoris Platform](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## 🚀 Features

### 📚 Learn Module
- Comprehensive online courses with video lessons
- Interactive quizzes and assessments
- Progress tracking and certificates
- Learning paths and skill development
- Note-taking and bookmarking

### 💼 Earn Module  
- Job marketplace with curated listings
- Freelance opportunities
- Resume builder and templates
- Salary insights and market data
- Interview preparation tools

### 🎮 Fun Module
- Engaging games and challenges
- Community discussions and posts
- Leaderboards and achievements
- Social features and user interactions
- Progress tracking across games

### 🔧 Apps Module
- Productivity tools and utilities
- Code formatters and generators
- Design tools and converters
- Calculators and converters
- Developer utilities

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: TailwindCSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Icons**: Lucide React
- **Hosting**: Vercel (recommended)
- **Package Manager**: npm/yarn/pnpm

## 📁 Project Structure

```
celoris-platform/
├── app/                      # Next.js 14 App Router
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── learn/               # Learn module
│   ├── earn/                # Earn module
│   ├── fun/                 # Fun module
│   └── apps/                # Apps module
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── header.tsx           # Navigation header
│   ├── footer.tsx           # Footer component
│   └── hero-section.tsx     # Homepage hero
├── lib/                     # Utilities and configurations
│   ├── utils.ts             # Helper functions
│   ├── supabase-client.ts   # Client-side Supabase
│   ├── supabase-server.ts   # Server-side Supabase
│   └── database.types.ts    # TypeScript types
└── supabase-schema.sql      # Database schema
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/celoris-platform.git
cd celoris-platform
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy the `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

4. Update the environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Set Up Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and execute the contents of `supabase-schema.sql`
4. This will create all the required tables and schemas

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or  
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System

### Colors

- **Primary Green**: `#2C7A4F` - Brand color for CTAs and highlights
- **Surface**: `#FFFFFF` - Card and component backgrounds
- **Background**: `#F8F9FA` - Page backgrounds
- **Text Primary**: `#212529` - Main text color
- **Text Secondary**: `#6C757D` - Supporting text

### Typography

- **Font Family**: Inter (Google Fonts)
- **Scale**: Major Third ratio (1.25)
- **Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold)

### Components

Built with shadcn/ui for consistency and accessibility:
- Buttons with multiple variants
- Cards with hover effects
- Forms with proper validation states
- Responsive navigation
- Modal dialogs and sheets

## 📊 Database Schema

The application uses a modular database schema with separate namespaces:

- **learn**: Courses, lessons, quizzes, enrollments
- **earn**: Jobs, applications, transactions, skills
- **fun**: Games, posts, comments, leaderboards
- **apps**: Tools, categories, favorites
- **public**: Shared tables (notifications, settings)

## 🔐 Authentication

Supabase Auth is integrated for:
- Email/password authentication
- Magic link authentication
- Social providers (optional)
- User profile management
- Session management

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables

Required for production:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=your_app_url
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/user` - Get current user

### Course Endpoints

- `GET /api/courses` - List all courses
- `GET /api/courses/[id]` - Get course details
- `POST /api/courses` - Create course (admin)
- `POST /api/enrollments` - Enroll in course

### Job Endpoints

- `GET /api/jobs` - List all jobs
- `GET /api/jobs/[id]` - Get job details
- `POST /api/applications` - Apply to job

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@celoris.com
- 💬 Discord: [Join our community](https://discord.gg/celoris)
- 📖 Documentation: [docs.celoris.com](https://docs.celoris.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/celoris-platform/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the powerful backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the elegant icons

---

Built with ❤️ by the Celoris team