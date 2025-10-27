-- PACE Database Schema for Supabase
-- This is a local development schema that can be migrated to production

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('viewer', 'editor', 'admin', 'super_admin');
CREATE TYPE roster_session_type AS ENUM ('initial_mel', 'final_mel');
CREATE TYPE roster_session_status AS ENUM ('draft', 'processing', 'completed', 'archived');
CREATE TYPE promotion_cycle AS ENUM ('SRA', 'SSG', 'TSG', 'MSG', 'SMS', 'CMS');
CREATE TYPE member_category AS ENUM ('eligible', 'ineligible', 'discrepancy', 'btz', 'small_unit');

-- =====================================================
-- Users and Authentication (extends Supabase auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    rank TEXT,
    grade TEXT,
    unit TEXT,
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    phone TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Organizations/Units
-- =====================================================
CREATE TABLE IF NOT EXISTS public.units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    pascode TEXT UNIQUE NOT NULL,
    parent_unit_id UUID REFERENCES public.units(id),
    commander_id UUID REFERENCES public.profiles(id),
    address TEXT,
    phone TEXT,
    email TEXT,
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unit members (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.unit_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'viewer',
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(unit_id, user_id)
);

-- =====================================================
-- Roster Sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.roster_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_type roster_session_type NOT NULL,
    cycle promotion_cycle NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2100),
    status roster_session_status DEFAULT 'draft',
    created_by UUID REFERENCES public.profiles(id),
    unit_id UUID REFERENCES public.units(id),
    file_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    total_members INTEGER DEFAULT 0,
    statistics JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Roster Members
-- =====================================================
CREATE TABLE IF NOT EXISTS public.roster_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.roster_sessions(id) ON DELETE CASCADE,

    -- Member identification
    ssan TEXT NOT NULL,
    last_4_ssn TEXT GENERATED ALWAYS AS (RIGHT(ssan, 4)) STORED,
    full_name TEXT NOT NULL,
    last_name TEXT,
    first_name TEXT,
    middle_initial TEXT,

    -- Military information
    rank TEXT,
    grade TEXT,
    afsc TEXT,
    unit TEXT,
    pascode TEXT,

    -- Dates
    date_of_rank DATE,
    dos DATE,
    dor DATE,
    pdd DATE,
    ets DATE,

    -- Eligibility information
    category member_category DEFAULT 'eligible',
    is_eligible BOOLEAN DEFAULT TRUE,
    eligibility_reason TEXT,
    eligibility_data JSONB DEFAULT '{}',

    -- BTZ specific
    is_btz_eligible BOOLEAN DEFAULT FALSE,
    btz_data JSONB DEFAULT '{}',

    -- Edit tracking
    is_edited BOOLEAN DEFAULT FALSE,
    edit_history JSONB[] DEFAULT ARRAY[]::JSONB[],
    original_data JSONB,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(session_id, ssan)
);

-- =====================================================
-- Senior Raters
-- =====================================================
CREATE TABLE IF NOT EXISTS public.senior_raters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.roster_sessions(id) ON DELETE CASCADE,
    pascode TEXT NOT NULL,
    name TEXT NOT NULL,
    rank TEXT,
    title TEXT,
    signature_block TEXT,
    email TEXT,
    phone TEXT,
    is_small_unit_rater BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(session_id, pascode, is_small_unit_rater)
);

-- =====================================================
-- Generated Reports
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.roster_sessions(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL,
    report_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    format TEXT, -- 'pdf', 'excel', 'csv'
    generation_params JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Custom Logos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.custom_logos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.roster_sessions(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.units(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    dimensions JSONB, -- {width: x, height: y}
    uploaded_by UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Audit Log
-- =====================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    changes JSONB,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_roster_sessions_status ON public.roster_sessions(status);
CREATE INDEX idx_roster_sessions_unit ON public.roster_sessions(unit_id);
CREATE INDEX idx_roster_sessions_created_by ON public.roster_sessions(created_by);

CREATE INDEX idx_roster_members_session ON public.roster_members(session_id);
CREATE INDEX idx_roster_members_category ON public.roster_members(category);
CREATE INDEX idx_roster_members_pascode ON public.roster_members(pascode);
CREATE INDEX idx_roster_members_ssan ON public.roster_members(ssan);
CREATE INDEX idx_roster_members_last_4 ON public.roster_members(last_4_ssn);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roster_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roster_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.senior_raters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Units policies
CREATE POLICY "Users can view units they belong to"
    ON public.units FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.unit_members
            WHERE unit_id = units.id AND user_id = auth.uid()
        ) OR
        commander_id = auth.uid()
    );

-- Roster sessions policies
CREATE POLICY "Users can view sessions from their units"
    ON public.roster_sessions FOR SELECT
    USING (
        created_by = auth.uid() OR
        unit_id IN (
            SELECT unit_id FROM public.unit_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create sessions for their units"
    ON public.roster_sessions FOR INSERT
    WITH CHECK (
        unit_id IN (
            SELECT unit_id FROM public.unit_members
            WHERE user_id = auth.uid() AND role IN ('editor', 'admin')
        )
    );

CREATE POLICY "Users can update their own sessions"
    ON public.roster_sessions FOR UPDATE
    USING (
        created_by = auth.uid() OR
        unit_id IN (
            SELECT unit_id FROM public.unit_members
            WHERE user_id = auth.uid() AND role IN ('editor', 'admin')
        )
    );

-- Roster members policies
CREATE POLICY "Users can view members from their sessions"
    ON public.roster_members FOR SELECT
    USING (
        session_id IN (
            SELECT id FROM public.roster_sessions
            WHERE created_by = auth.uid() OR
            unit_id IN (
                SELECT unit_id FROM public.unit_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage members in their sessions"
    ON public.roster_members FOR ALL
    USING (
        session_id IN (
            SELECT id FROM public.roster_sessions
            WHERE created_by = auth.uid() OR
            unit_id IN (
                SELECT unit_id FROM public.unit_members
                WHERE user_id = auth.uid() AND role IN ('editor', 'admin')
            )
        )
    );

-- Audit logs policies
CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs"
    ON public.audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roster_sessions_updated_at BEFORE UPDATE ON public.roster_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roster_members_updated_at BEFORE UPDATE ON public.roster_members
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_senior_raters_updated_at BEFORE UPDATE ON public.senior_raters
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        changes,
        metadata
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE
            WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
            WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
                'old', to_jsonb(OLD),
                'new', to_jsonb(NEW)
            )
            WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
        END,
        jsonb_build_object(
            'table_name', TG_TABLE_NAME,
            'operation', TG_OP,
            'timestamp', NOW()
        )
    );

    RETURN CASE
        WHEN TG_OP = 'DELETE' THEN OLD
        ELSE NEW
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_roster_sessions AFTER INSERT OR UPDATE OR DELETE ON public.roster_sessions
    FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_roster_members AFTER INSERT OR UPDATE OR DELETE ON public.roster_members
    FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Function to calculate roster statistics
CREATE OR REPLACE FUNCTION public.calculate_roster_statistics(session_id_param UUID)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total', COUNT(*),
        'eligible', COUNT(*) FILTER (WHERE category = 'eligible'),
        'ineligible', COUNT(*) FILTER (WHERE category = 'ineligible'),
        'discrepancy', COUNT(*) FILTER (WHERE category = 'discrepancy'),
        'btz', COUNT(*) FILTER (WHERE category = 'btz'),
        'small_unit', COUNT(*) FILTER (WHERE category = 'small_unit'),
        'edited', COUNT(*) FILTER (WHERE is_edited = TRUE)
    ) INTO stats
    FROM public.roster_members
    WHERE session_id = session_id_param;

    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, metadata)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();