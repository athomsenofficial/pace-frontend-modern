# PACE System v2.0 - Updated Structure

## Major Changes

### ✅ Removed
- **Members Page** - Removed as requested

### ✨ Added
1. **Administrative Dashboard** (`/admin`) - System administration and monitoring
2. **Memorandum Generator** (`/memo-generator`) - Create official Air Force memoranda
3. **Account Page** (`/account`) - User profile and security settings
4. **User Roles System** - Role-based access control with Zustand

### 🔄 Updated
- **Header Navigation** - Now includes dropdown menus and user menu
- **Routing** - Role-based protected routes
- **Settings** - Renamed from general settings to system preferences

## Navigation Structure

### Main Navigation (Header)
```
┌─ Dashboard
├─ Master Eligibility List (Dropdown)
│  ├─ Initial MEL
│  └─ Final MEL
├─ Memorandum
├─ Reports
└─ Admin (Visible only to Admin/Super Admin)
```

### User Menu (Top Right Dropdown)
```
User Profile Card
├─ Account Settings
├─ Preferences
└─ Logout
```

## User Roles & Permissions

### Role Hierarchy
1. **Viewer** - Read-only access
   - View Dashboard
   - View Reports
   - View MEL pages (no create/edit)

2. **Editor** - Can create and edit
   - All Viewer permissions
   - Create Initial/Final MELs
   - Generate Memoranda
   - Download reports

3. **Admin** - Full administrative access
   - All Editor permissions
   - Access Admin Dashboard
   - View user statistics
   - View system health

4. **Super Admin** - System administration
   - All Admin permissions
   - User management
   - Role assignment
   - System settings

## Pages Overview

### 1. Dashboard (`/`)
**Access:** All users
**Features:**
- System statistics (sessions, members, eligible, completed)
- Quick action cards for Initial/Final MEL
- Recent activity feed
- Feature highlights

### 2. Initial MEL (`/initial-mel`)
**Access:** Editor and above
**Features:**
- Promotion cycle & year selection
- Drag-and-drop file upload (CSV/XLSX)
- Processing status tracking
- Results summary with eligibility breakdown
- Required/optional columns sidebar
- PII removal warnings
- PDF download

### 3. Final MEL (`/final-mel`)
**Access:** Editor and above
**Features:**
- Roster file upload
- Senior rater information form (per PAS code)
- Multi-step workflow
- Interactive PDF with checkboxes (MP/PN/NRN)
- Small unit consolidation support
- Process flow guide

### 4. Memorandum Generator (`/memo-generator`)
**Access:** Editor and above
**Features:**
- Multiple memo types (Award, Admin, Info, Request, Routing, Custom)
- Header information form
- Classification levels
- Auto-formatted memo content
- Copy to clipboard
- Save as draft
- Download PDF
- AFI 33-332 compliance guide

### 5. Reports (`/reports`)
**Access:** All users
**Features:**
- Report statistics
- List of generated MEL documents
- Download and preview actions
- File metadata (date, size, member count)
- Filter by type/date

### 6. Administrative Dashboard (`/admin`)
**Access:** Admin and above only
**Features:**
- User statistics (total, by role, active)
- System metrics (sessions, storage, uptime)
- User role breakdown
- Quick admin actions
- System health monitoring
- Recent activity log with security alerts

### 7. Account Settings (`/account`)
**Access:** All users
**Features:**
- Profile information (name, rank, unit, contact)
- Current role and permissions display
- Password change with requirements
- Notification preferences
- Security settings

### 8. Settings (`/settings`)
**Access:** All users
**Features:**
- General preferences
- Notification settings
- Database connection status
- System configuration (admin only)

## Technical Implementation

### User Store (Zustand)
**Location:** `src/stores/useAuthStore.ts`

```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  rank: string
  unit: string
  role: UserRole
}

// Available methods
- setUser(user)
- logout()
- hasPermission(role)
```

### Role-Based Routing
```typescript
// Protected Admin Route
<Route
  path="/admin"
  element={
    hasPermission('admin') ? (
      <Layout><AdminDashboard /></Layout>
    ) : (
      <Navigate to="/" replace />
    )
  }
/>
```

### Auto-Login for Development
In `App.tsx`, line 13:
```typescript
mockLogin('editor') // Change to 'admin' or 'super_admin' to test
```

## Navigation Components

### MEL Dropdown (Headless UI Menu)
- Hover/click to reveal Initial & Final MEL options
- Active state highlighting
- Smooth transitions

### User Menu Dropdown
- User profile card with name, rank, role badge
- Account Settings link
- Preferences link
- Logout button

## Color Scheme
**Nature Green 2025** - Professional, fresh palette
- Primary: `#4CAF50` (Vibrant Green)
- Success: `#66BB6A` (Bright Green)
- Warning: `#FFA726` (Warm Orange)
- Danger: `#EF5350` (Coral Red)
- Special: `#26A69A` (Teal)

## File Structure
```
src/
├── pages/
│   ├── Dashboard.tsx
│   ├── InitialMEL.tsx
│   ├── FinalMEL.tsx
│   ├── MemoGenerator.tsx          ← NEW
│   ├── AdminDashboard.tsx         ← NEW
│   ├── Account.tsx                ← NEW
│   ├── Reports.tsx
│   ├── Settings.tsx
│   └── index.ts
├── stores/
│   └── useAuthStore.ts            ← NEW
├── features/
│   └── mel/
│       └── components/
│           └── FileUpload.tsx
├── shared/
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx         ← UPDATED (Dropdown menus)
│       │   ├── Footer.tsx
│       │   └── Layout.tsx
│       └── ui/
└── App.tsx                        ← UPDATED (Role-based routing)
```

## Routes
```
/                    → Dashboard
/initial-mel         → Initial MEL Processing
/final-mel           → Final MEL Processing
/memo-generator      → Memorandum Generator (NEW)
/reports             → Generated Reports
/settings            → System Settings
/account             → Account Settings (NEW)
/admin               → Admin Dashboard (NEW, Protected)
/test-supabase       → Database Test
```

## Build Stats
- Bundle Size: 603 KB (176 KB gzipped)
- Build Time: ~1.5s
- Status: ✅ Production ready

## Development Server
Running at: **http://localhost:5175/**

## Next Steps
1. Connect Zustand auth store to Supabase authentication
2. Implement actual file upload to FastAPI backend
3. Wire up memo generator to PDF generation
4. Add real-time notifications
5. Implement audit logging for admin actions
6. Add data persistence for drafts
7. Connect reports to actual database queries

## Testing Role-Based Access
Change line 14 in `src/App.tsx`:
```typescript
mockLogin('viewer')      // Test viewer access
mockLogin('editor')      // Test editor access
mockLogin('admin')       // Test admin access (can see Admin Dashboard)
mockLogin('super_admin') // Test super admin access
```

## Security Features
- Role-based access control
- Protected admin routes
- Password requirements displayed
- Security alerts in admin dashboard
- Logout functionality
- Session persistence with Zustand persist middleware
