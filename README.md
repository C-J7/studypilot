# StudyPilot 📚

> Transform your academic journey with intelligent study planning and organization

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49.4-green)](https://supabase.com/)
[![Deployment](https://img.shields.io/badge/deployment-Vercel-black)](https://studypilot.vercel.app/)

StudyPilot is a modern university productivity platform that helps students organize their academic materials, generate intelligent study schedules, and track their progress effectively.

![StudyPilot Dashboard](https://studypilot.vercel.app/dashboard-preview.png)

## 🎯 Features

- **Smart Syllabus Management**
  - Upload and organize course materials by Faculty → Department → Semester
  - Automatic metadata extraction from PDF syllabi
  - Searchable repository of course materials

- **Intelligent Study Planning**
  - Automated study schedule generation
  - Smart distribution of topics based on exam dates
  - Customizable study blocks and preferences
  - Priority-based topic organization

- **Progress Tracking**
  - Visual progress indicators
  - Session completion tracking
  - Engagement analytics
  - Performance insights

- **Smart Reminders**
  - Customizable notification system
  - Google Calendar integration (coming soon)
  - Email reminders for study sessions

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 14
  - React 18
  - Tailwind CSS
  - ShadcN UI Components

- **Backend & Auth**
  - Supabase
  - PostgreSQL
  - Row Level Security (RLS)

- **Deployment**
  - Vercel (Frontend)
  - Supabase (Backend)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/studypilot.git
cd studypilot
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📱 Core Features Implementation

### Authentication Flow
- Email/password authentication via Supabase
- Secure session management
- Protected routes and API endpoints


### Progress Tracking
- Real-time progress updates
- Session completion tracking
- Visual progress indicators
- Performance analytics

## 🔒 Security

- Supabase Row Level Security (RLS) policies
- Secure authentication flow
- Protected API routes
- Environment variable protection

## 🌐 Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

- Production: [https://studypilot.vercel.app](https://studypilot.vercel.app)
- Staging: [https://staging.studypilot.vercel.app](https://staging.studypilot.vercel.app)

## 🤝 Contributions are Welcome

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



Made with ❤️ by the StudyPilot Team



