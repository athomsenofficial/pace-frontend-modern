# Supabase Setup Guide for PACE System

## ✅ Credentials Configured

Your Supabase project is connected with:
- **Project URL**: https://swvkaqrdhyoccwtzqabg.supabase.co
- **Project Reference**: swvkaqrdhyoccwtzqabg
- **Anon Key**: Configured in .env

## 📋 Next Steps to Complete Setup

### 1. Run Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/swvkaqrdhyoccwtzqabg
2. Navigate to **SQL Editor** (in left sidebar)
3. Click **New Query**
4. Copy ALL contents from `/Users/drew/Coding/pace-frontend-modern/supabase/schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see "Success. No rows returned" - this means tables were created successfully.

### 2. Verify Tables Were Created

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - profiles
   - units
   - unit_members
   - roster_sessions
   - roster_members
   - senior_raters
   - reports
   - custom_logos
   - audit_logs

### 3. Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Click **New Bucket** for each:

   **Bucket 1: logos**
   - Name: `logos`
   - Public: ✅ (toggle ON)
   - Click Create

   **Bucket 2: rosters**
   - Name: `rosters`
   - Public: ❌ (keep OFF)
   - Click Create

   **Bucket 3: reports**
   - Name: `reports`
   - Public: ❌ (keep OFF)
   - Click Create

### 4. Configure Authentication (Optional)

1. Go to **Authentication** → **Providers**
2. **Email** is enabled by default
3. Optionally configure:
   - Email templates (Authentication → Email Templates)
   - Custom SMTP (Authentication → SMTP Settings)
   - Additional providers (Google, GitHub, etc.)

### 5. Configure RLS Policies (Important for Security)

The schema already includes basic RLS policies, but you may want to adjust them:

1. Go to **Authentication** → **Policies**
2. Review policies for each table
3. Policies are already set to:
   - Users can only view their own profile
   - Users can only access roster sessions from their units
   - Admins have broader access

## 🧪 Testing Your Connection

### Quick Test in Browser Console

1. Open your app: http://localhost:5173
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run this test:

```javascript
// Test if Supabase is connected
const testConnection = async () => {
  const { data, error } = await window.supabase
    .from('profiles')
    .select('count')
    .single()

  if (error) {
    console.error('Connection failed:', error)
  } else {
    console.log('✅ Supabase connected successfully!')
  }
}

testConnection()
```

### Create a Test User

In your Supabase dashboard:

1. Go to **Authentication** → **Users**
2. Click **Invite User**
3. Enter:
   - Email: test@example.com
   - Password: TestPassword123!
4. Click **Send Invite**

Or use the SQL Editor:

```sql
-- Create a test user profile (after creating auth user)
INSERT INTO profiles (id, full_name, username, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  'Test User',
  'testuser',
  'admin'
);
```

## 🔒 Security Checklist

- [ ] RLS is enabled on all tables (already done in schema)
- [ ] Anon key is only used in frontend (never service_role key)
- [ ] Storage buckets have appropriate public/private settings
- [ ] Email confirmation is configured (optional for dev)

## 🚀 Ready to Use!

Your Supabase backend is now configured and ready for:
- User authentication
- Data storage with real-time updates
- File uploads
- Secure API access

## 📝 Useful Supabase Dashboard Links

- **Project Dashboard**: https://supabase.com/dashboard/project/swvkaqrdhyoccwtzqabg
- **Table Editor**: https://supabase.com/dashboard/project/swvkaqrdhyoccwtzqabg/editor
- **SQL Editor**: https://supabase.com/dashboard/project/swvkaqrdhyoccwtzqabg/sql
- **Authentication**: https://supabase.com/dashboard/project/swvkaqrdhyoccwtzqabg/auth/users
- **Storage**: https://supabase.com/dashboard/project/swvkaqrdhyoccwtzqabg/storage/buckets
- **API Docs**: https://supabase.com/dashboard/project/swvkaqrdhyoccwtzqabg/api

## 🆘 Troubleshooting

### Common Issues:

1. **"relation does not exist" error**
   - Make sure you ran the entire schema.sql file
   - Check that all tables were created

2. **"permission denied" error**
   - Check RLS policies are properly configured
   - Ensure user is authenticated for protected routes

3. **Connection timeout**
   - Verify your internet connection
   - Check if Supabase project is active (free tier pauses after 1 week of inactivity)

4. **CORS errors**
   - These should not occur with the anon key
   - If they do, check your project URL is correct

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Project Status**: https://status.supabase.com