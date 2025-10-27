import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Type helpers for cleaner code
type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client (with fallback for missing config)
// Note: Using 'as any' cast to work around type inference issues with placeholder credentials
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'x-application-name': 'pace-frontend'
      }
    }
  }
) as any

// =====================================================
// Authentication Functions
// =====================================================

export const auth = {
  signUp: async (email: string, password: string, metadata?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
  },

  updatePassword: async (newPassword: string) => {
    return await supabase.auth.updateUser({
      password: newPassword
    })
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  },

  getUser: async () => {
    return await supabase.auth.getUser()
  },

  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// =====================================================
// Database Functions
// =====================================================

export const db = {
  // Profile operations
  profiles: {
    get: async (userId: string) => {
      return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    },

    update: async (userId: string, data: UpdateDto<'profiles'>) => {
      return await supabase
        .from('profiles')
        .update(data as any)
        .eq('id', userId)
        .select()
        .single()
    },

    getByUsername: async (username: string) => {
      return await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()
    }
  },

  // Roster session operations
  rosterSessions: {
    create: async (data: InsertDto<'roster_sessions'>) => {
      return await supabase
        .from('roster_sessions')
        .insert(data as any)
        .select()
        .single()
    },

    get: async (sessionId: string) => {
      return await supabase
        .from('roster_sessions')
        .select(`
          *,
          unit:units(*),
          created_by:profiles(*)
        `)
        .eq('id', sessionId)
        .single()
    },

    list: async (filters?: any) => {
      let query = supabase
        .from('roster_sessions')
        .select(`
          *,
          unit:units(*),
          created_by:profiles(*)
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.unitId) {
        query = query.eq('unit_id', filters.unitId)
      }
      if (filters?.year) {
        query = query.eq('year', filters.year)
      }
      if (filters?.cycle) {
        query = query.eq('cycle', filters.cycle)
      }

      return await query
    },

    update: async (sessionId: string, data: UpdateDto<'roster_sessions'>) => {
      return await supabase
        .from('roster_sessions')
        .update(data as any)
        .eq('id', sessionId)
        .select()
        .single()
    },

    delete: async (sessionId: string) => {
      return await supabase
        .from('roster_sessions')
        .delete()
        .eq('id', sessionId)
    },

    updateStatistics: async (sessionId: string) => {
      const { data: stats } = await supabase
        .rpc('calculate_roster_statistics', { session_id_param: sessionId })

      if (stats && typeof stats === 'object' && stats !== null && 'total' in stats) {
        return await supabase
          .from('roster_sessions')
          .update({ statistics: stats as any, total_members: stats.total as number })
          .eq('id', sessionId)
      }
    }
  },

  // Roster member operations
  rosterMembers: {
    create: async (data: InsertDto<'roster_members'>) => {
      return await supabase
        .from('roster_members')
        .insert(data as any)
        .select()
    },

    bulkCreate: async (members: InsertDto<'roster_members'>[]) => {
      return await supabase
        .from('roster_members')
        .insert(members as any)
        .select()
    },

    get: async (memberId: string) => {
      return await supabase
        .from('roster_members')
        .select('*')
        .eq('id', memberId)
        .single()
    },

    listBySession: async (sessionId: string, filters?: any) => {
      let query = supabase
        .from('roster_members')
        .select('*')
        .eq('session_id', sessionId)

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.isEligible !== undefined) {
        query = query.eq('is_eligible', filters.isEligible)
      }
      if (filters?.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,ssan.ilike.%${filters.search}%,pascode.ilike.%${filters.search}%`
        )
      }

      return await query.order('last_name', { ascending: true })
    },

    update: async (memberId: string, data: UpdateDto<'roster_members'>) => {
      // Store the edit in history
      const { data: currentMember } = await db.rosterMembers.get(memberId)

      if (currentMember) {
        const editHistory = (currentMember.edit_history || []) as any[]
        editHistory.push({
          timestamp: new Date().toISOString(),
          changes: data,
          previous: currentMember
        })

        return await supabase
          .from('roster_members')
          .update({
            ...data,
            is_edited: true,
            edit_history: editHistory as any,
            original_data: (currentMember.original_data || currentMember) as any
          } as any)
          .eq('id', memberId)
          .select()
          .single()
      }
    },

    delete: async (memberId: string) => {
      return await supabase
        .from('roster_members')
        .delete()
        .eq('id', memberId)
    }
  },

  // Senior rater operations
  seniorRaters: {
    create: async (data: InsertDto<'senior_raters'>) => {
      return await supabase
        .from('senior_raters')
        .insert(data as any)
        .select()
    },

    bulkCreate: async (raters: InsertDto<'senior_raters'>[]) => {
      return await supabase
        .from('senior_raters')
        .insert(raters as any)
        .select()
    },

    listBySession: async (sessionId: string) => {
      return await supabase
        .from('senior_raters')
        .select('*')
        .eq('session_id', sessionId)
        .order('pascode', { ascending: true })
    },

    update: async (raterId: string, data: UpdateDto<'senior_raters'>) => {
      return await supabase
        .from('senior_raters')
        .update(data as any)
        .eq('id', raterId)
        .select()
        .single()
    }
  },

  // Unit operations
  units: {
    list: async () => {
      return await supabase
        .from('units')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })
    },

    get: async (unitId: string) => {
      return await supabase
        .from('units')
        .select(`
          *,
          commander:profiles(*),
          members:unit_members(*, user:profiles(*))
        `)
        .eq('id', unitId)
        .single()
    },

    getByPascode: async (pascode: string) => {
      return await supabase
        .from('units')
        .select('*')
        .eq('pascode', pascode)
        .single()
    }
  },

  // Audit log operations
  auditLogs: {
    create: async (action: string, entityType: string, entityId: string, changes?: any) => {
      return await supabase
        .from('audit_logs')
        .insert({
          action,
          entity_type: entityType,
          entity_id: entityId,
          changes: changes || null,
          metadata: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            url: window.location.href
          } as any
        })
    },

    list: async (filters?: any) => {
      let query = supabase
        .from('audit_logs')
        .select('*, user:profiles(*)')
        .order('created_at', { ascending: false })

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters?.entityType) {
        query = query.eq('entity_type', filters.entityType)
      }
      if (filters?.entityId) {
        query = query.eq('entity_id', filters.entityId)
      }

      return await query
    }
  }
}

// =====================================================
// Storage Functions
// =====================================================

export const storage = {
  uploadLogo: async (sessionId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${sessionId}/logo.${fileExt}`

    return await supabase.storage
      .from('logos')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      })
  },

  getLogo: (path: string) => {
    return supabase.storage
      .from('logos')
      .getPublicUrl(path)
  },

  deleteLogo: async (path: string) => {
    return await supabase.storage
      .from('logos')
      .remove([path])
  },

  uploadRoster: async (sessionId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${sessionId}/roster_${Date.now()}.${fileExt}`

    return await supabase.storage
      .from('rosters')
      .upload(fileName, file, {
        contentType: file.type
      })
  },

  downloadFile: async (bucket: string, path: string) => {
    return await supabase.storage
      .from(bucket)
      .download(path)
  }
}

// =====================================================
// Real-time Subscriptions
// =====================================================

export const realtime = {
  subscribeToRosterChanges: (sessionId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`roster-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'roster_members',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe()
  },

  subscribeToSessionUpdates: (sessionId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'roster_sessions',
          filter: `id=eq.${sessionId}`
        },
        callback
      )
      .subscribe()
  },

  unsubscribe: async (subscription: any) => {
    return await supabase.removeChannel(subscription)
  }
}