# PACE Frontend Modern

A modern React application with Tailwind CSS and Supabase integration for the Promotion and Career Eligibility (PACE) management system.

PACE Frontend Modern - React 19 TypeScript Vite application for Air Force promotion roster processing

## 🚀 Features

- **Modern Tech Stack**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom component library
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Backend Integration**: Connects to VPS-hosted FastAPI backend
- **Professional UI**: Custom color palette with modern design system
- **Component Library**: Pre-built UI components (Button, Input, Card, Modal, etc.)

## 🎨 Color Palette

The application uses a modern, professional color scheme:

- **Primary**: Electric Indigo (`#6366f1`)
- **Success**: Cyber Teal (`#14b8a6`)
- **Warning**: Amber Glow (`#fbbf24`)
- **Danger**: Coral Accent (`#fb7185`)
- **Special**: Purple Haze (`#a78bfa`)

## 📁 Project Structure

```
pace-frontend-modern/
├── src/
│   ├── app/                # App-level configuration
│   ├── features/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── roster/        # Roster management
│   │   ├── reports/       # Report generation
│   │   └── dashboard/     # Dashboard analytics
│   ├── shared/            # Shared resources
│   │   └── components/    # Reusable UI components
│   │       └── ui/       # Base UI components
│   ├── lib/              # External libraries config
│   │   └── supabase.ts   # Supabase client
│   └── styles/           # Global styles
├── supabase/
│   └── schema.sql        # Database schema
└── .env                  # Environment variables
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for production)
- Access to VPS backend API

### Installation

1. Clone the repository:
```bash
cd pace-frontend-modern
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Then edit `.env` with your actual values:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_API_URL`: Your VPS backend URL

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🗄️ Database Setup

### Local Development

The database schema is in `supabase/schema.sql`. To set up your Supabase database:

1. Create a new Supabase project
2. Run the schema SQL in the Supabase SQL editor
3. Update your `.env` file with the project credentials

### Database Features

- **Authentication**: Built-in user management
- **Row Level Security**: Secure data access
- **Real-time subscriptions**: Live updates
- **File storage**: For logos and documents

## 🔗 Backend Integration

The application connects to two services:

1. **Supabase**: For database, auth, and storage
2. **VPS Backend**: For roster processing (FastAPI)

Configure the VPS backend URL in `.env`:
```
VITE_API_URL=http://your-vps-ip:8000
```

## 🧩 Component Library

### Available Components

- **Button**: Multiple variants (primary, secondary, success, danger, etc.)
- **Input**: Form input with validation support
- **Select**: Dropdown select component
- **Card**: Container with header, content, and footer
- **Badge**: Status indicators
- **Modal**: Dialog/popup component

### Usage Example

```tsx
import { Button, Card, Input } from '@/shared/components/ui'

function MyComponent() {
  return (
    <Card>
      <Input label="Name" placeholder="Enter name" />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deployment Options

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `dist/` folder
- **VPS**: Copy `dist/` to your server
- **Docker**: Use the provided Dockerfile (coming soon)

## 📝 Next Steps

- [ ] Connect to live Supabase instance
- [ ] Integrate with VPS backend API
- [ ] Implement authentication flow
- [ ] Add roster upload functionality
- [ ] Build dashboard analytics
- [ ] Create report generation features
- [ ] Add real-time collaboration

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

U.S. Government Work - Not subject to copyright in the United States.

## 🆘 Support

For issues or questions:
- Frontend issues: Check this README
- Backend issues: See pace-backend-clean documentation
- Database issues: Check Supabase documentation

---

**Current Status**: ✅ Development environment ready

**Demo Available**: Run `npm run dev` to see the component demo
