# PublishHub - Medium Clone

A full-featured publishing platform built with Next.js 16, React 19, and TypeScript. Features rich content creation, user authentication, social interactions, and optimized performance.

## 🚀 Features

- **Authentication**: JWT-based auth with signup/login
- **Rich Text Editor**: Markdown editor with image uploads
- **Posts Management**: Create, edit, delete posts with draft/publish states
- **Social Features**: Comments, likes/claps, follow authors
- **Search & Tags**: Full-text search and tag-based filtering
- **SEO Optimized**: Dynamic metadata and Open Graph tags
- **Responsive Design**: Mobile-first responsive UI
- **Performance**: SSG/ISR, image optimization, lazy loading

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Custom JWT implementation
- **Data Fetching**: SWR
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── posts/             # Post pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── auth-forms/       # Authentication forms
│   ├── comments/         # Comment system
│   ├── reactions/        # Like/clap functionality
│   └── rich-editor/      # Text editor components
├── lib/                  # Utilities and configurations
│   ├── auth.ts          # Authentication logic
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helper functions
└── hooks/               # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medium-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your environment variables:
```env
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 🔧 Key Features Implementation

### Authentication
- JWT-based authentication system
- Protected routes and middleware
- User registration and login forms
- Profile management

### Rich Text Editor
- Markdown-based editor with toolbar
- Real-time preview functionality
- Image upload support
- Draft auto-save

### Posts System
- CRUD operations for posts
- Draft and published states
- Tag system for categorization
- SEO-optimized post pages

### Social Features
- Nested comment system
- Like/clap reactions with optimistic updates
- Follow/unfollow authors
- Personalized feed

### Search & Discovery
- Full-text search with debouncing
- Tag-based filtering
- Explore page with popular content

## 🎨 UI Components

Built with a custom component library including:
- Button, Input, Textarea
- Dropdown menus and modals
- Alert and notification systems
- Responsive navigation
- Loading states and error boundaries

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## ⚡ Performance Optimizations

- Next.js Image optimization
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- Code splitting and lazy loading
- SWR for efficient data fetching

## 🔍 SEO Features

- Dynamic metadata generation
- Open Graph tags for social sharing
- Structured data markup
- Sitemap generation
- Optimized page titles and descriptions

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## 🧪 Testing

Run tests with:
```bash
npm run test
```

Test coverage includes:
- Component unit tests
- Integration tests for key flows
- API route testing

## 🔐 Environment Variables

Required environment variables:

- `JWT_SECRET` - Secret key for JWT token signing
- `NEXT_PUBLIC_API_URL` - Base URL for API calls
- `NEXTAUTH_URL` - Canonical URL for authentication

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Posts Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Social Endpoints
- `GET /api/comments` - Get comments for post
- `POST /api/comments` - Create comment
- `POST /api/reactions` - Toggle like/clap
- `POST /api/follows` - Follow/unfollow user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons

## 📞 Support

For support and questions, please open an issue in the GitHub repository.