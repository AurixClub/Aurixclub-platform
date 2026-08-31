-- =============================================================================
-- AURIX CLUB PLATFORM - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- =============================================================================
-- This file defines the complete database design for AURIX Club Website & Admin CMS.
-- Compatible with Supabase Postgres, includes Table schemas, Foreign Keys, Indexes,
-- Row-Level Security (RLS) Policies, and Initial Seed Data.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ENUMS
-- =============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE department_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('draft', 'published', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'waitlisted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE program_status AS ENUM ('draft', 'published', 'completed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_category AS ENUM ('event', 'team', 'program', 'post', 'department', 'asset');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. TABLES DEFINITIONS
-- =============================================================================

-- 2.1 USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT ('user_' || replace(gen_random_uuid()::text, '-', '')),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    college TEXT,
    branch TEXT,
    year INTEGER,
    avatar_url TEXT,
    bio TEXT,
    role user_role NOT NULL DEFAULT 'member',
    department_id TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY DEFAULT ('dept_' || replace(gen_random_uuid()::text, '-', '')),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    status department_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 DEPARTMENT MEMBERS / LEADS
CREATE TABLE IF NOT EXISTS public.department_members (
    id TEXT PRIMARY KEY DEFAULT ('dm_' || replace(gen_random_uuid()::text, '-', '')),
    department_id TEXT NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Member',
    description TEXT,
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 TEAM MEMBERS (Founders & Core Leadership)
CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY DEFAULT ('team_' || replace(gen_random_uuid()::text, '-', '')),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    joined_year INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY DEFAULT ('event_' || replace(gen_random_uuid()::text, '-', '')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cover_image_url TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'in_person',
    category TEXT NOT NULL DEFAULT 'workshop',
    capacity INTEGER NOT NULL DEFAULT 100,
    registered_count INTEGER NOT NULL DEFAULT 0,
    status event_status NOT NULL DEFAULT 'published',
    created_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 EVENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id TEXT PRIMARY KEY DEFAULT ('reg_' || replace(gen_random_uuid()::text, '-', '')),
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'registered',
    ticket_code TEXT NOT NULL UNIQUE,
    checked_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, user_id)
);

-- 2.7 JOIN APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY DEFAULT ('app_' || replace(gen_random_uuid()::text, '-', '')),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    branch TEXT NOT NULL,
    year INTEGER NOT NULL,
    department_interests TEXT[] NOT NULL DEFAULT '{}',
    why_join TEXT NOT NULL,
    skills TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    status application_status NOT NULL DEFAULT 'pending',
    reviewed_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 POSTS & ARTICLES
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY DEFAULT ('post_' || replace(gen_random_uuid()::text, '-', '')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
    category TEXT NOT NULL DEFAULT 'announcement',
    tags TEXT[] NOT NULL DEFAULT '{}',
    status post_status NOT NULL DEFAULT 'published',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.9 PROGRAMS & WORKSHOPS
CREATE TABLE IF NOT EXISTS public.programs (
    id TEXT PRIMARY KEY DEFAULT ('prog_' || replace(gen_random_uuid()::text, '-', '')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cover_image_url TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
    status program_status NOT NULL DEFAULT 'published',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.10 MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media (
    id TEXT PRIMARY KEY DEFAULT ('media_' || replace(gen_random_uuid()::text, '-', '')),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category media_category NOT NULL DEFAULT 'asset',
    thumbnail_url TEXT,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    uploaded_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.11 EMAIL CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id TEXT PRIMARY KEY DEFAULT ('email_' || replace(gen_random_uuid()::text, '-', '')),
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    recipient_type TEXT NOT NULL,
    sent_count INTEGER NOT NULL DEFAULT 0,
    sent_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_departments_slug ON public.departments(slug);
CREATE INDEX IF NOT EXISTS idx_departments_status ON public.departments(status);
CREATE INDEX IF NOT EXISTS idx_dept_members_dept_id ON public.department_members(department_id);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_event_regs_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_regs_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON public.programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_status ON public.programs(status);

-- =============================================================================
-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles: Public can read basic profile, user can update own profile
CREATE POLICY "Public profiles are readable" ON public.profiles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (id = current_setting('request.jwt.claim.sub', true));

-- 4.2 Departments: Public can read active departments
CREATE POLICY "Active departments are readable" ON public.departments
    FOR SELECT USING (status = 'active');

-- 4.3 Department Members: Public can read department members
CREATE POLICY "Department members are readable" ON public.department_members
    FOR SELECT USING (true);

-- 4.4 Team Members: Public can read visible team members
CREATE POLICY "Visible team members are readable" ON public.team_members
    FOR SELECT USING (is_visible = true);

-- 4.5 Events: Public can read published events
CREATE POLICY "Published events are readable" ON public.events
    FOR SELECT USING (status = 'published');

-- 4.6 Event Registrations: Users can read and insert their own registrations
CREATE POLICY "Users can view own registrations" ON public.event_registrations
    FOR SELECT USING (user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can register for events" ON public.event_registrations
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claim.sub', true));

-- 4.7 Applications: Users can view own applications, submit new applications
CREATE POLICY "Users can view own applications" ON public.applications
    FOR SELECT USING (user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Anyone can submit application" ON public.applications
    FOR INSERT WITH CHECK (true);

-- 4.8 Posts & Programs: Public can read published items
CREATE POLICY "Published posts are readable" ON public.posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Published programs are readable" ON public.programs
    FOR SELECT USING (status = 'published');

-- =============================================================================
-- 5. INITIAL SEED DATA (Founders, Super Admin, Departments & Leads)
-- =============================================================================

-- SEED DATA
INSERT INTO public.profiles (id, email, password_hash, full_name, role, is_active)
VALUES
    ('admin_aurix_001', 'aurixclub.drait@gmail.com', 'a60e8ec7dc6c21e6fa0f91b4028bc6e8:7fb6b2df4be92a3f7899b828854c86e09e13dcf8c07e05698b6710b784a0d9e83ec8faad78b1cf64731ceb83e390c58e72ef0cb539b56f8f533a388e36e659b8', 'AURIX Super Admin', 'super_admin', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.departments (id, name, slug, description, status)
VALUES
    ('dept_tech_01', 'Technical Department', 'technical', 'Handles all technical initiatives, software projects, open source, and hands-on workshops.', 'active'),
    ('dept_sponsors_02', 'Sponsors & Industry Relations', 'sponsors-industry-relations', 'Manages corporate sponsorships, industry partnerships, alumni networks, and community relations.', 'active'),
    ('dept_research_03', 'Innovation & Research', 'innovation-research', 'Drives research papers, deep-tech experiments, patents, and cutting-edge innovation programs.', 'active'),
    ('dept_event_04', 'Event Management', 'event-management', 'Plans and executes flagship hackathons, tech fests, guest lectures, and campus experiences.', 'active'),
    ('dept_media_05', 'Social Media & Marketing', 'social-media-marketing', 'Manages digital branding, social outreach, graphic media design, and promotional campaigns.', 'active'),
    ('dept_startup_06', 'Entrepreneurship & Startup', 'entrepreneurship-startup', 'Supports student startup founders, prototype incubation, pitch nights, and venture acceleration.', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.team_members (id, full_name, designation, department_id, avatar_url, bio, github_url, linkedin_url, display_order, is_visible, joined_year)
VALUES
    ('team_founder_01', 'Advaith Kolkar', 'Founder & Lead Architect', 'dept_tech_01', '/team/team-4.png', 'Founding visionary of AURIX club. Architecting distributed platforms, engineering curricula, and inspiring the next generation of builders and technology leaders.', 'https://github.com/advaithkolkar', 'https://linkedin.com/in/advaithkolkar', 1, true, 2023),
    ('team_cofounder_02', 'Anish Sharma', 'Co-Founder & Head of Operations', 'dept_sponsors_02', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', 'Co-founder orchestrating club strategy, corporate partnerships, flagship ecosystem programs, and cross-department collaboration across universities.', 'https://github.com/anishsharma', 'https://linkedin.com/in/anishsharma', 2, true, 2023),
    ('team_006', 'Adithya P', 'EM Department Head', 'dept_event_04', '/team/team-1.jpg', 'Department Head of Event Management. Leading event planning, hackathons, and campus experiences.', NULL, NULL, 4, true, 2024),
    ('team_007', 'Sony', 'IRS Co-Lead', 'dept_sponsors_02', '/team/team-3.jpg', 'IRS Co-Lead, 3rd Year, IEM Branch. Managing corporate sponsorships, alumni relations, and industry partnerships.', NULL, NULL, 5, true, 2024),
    ('team_008', 'Rajveer Singh', 'IRS Co-Lead', 'dept_sponsors_02', '/team/team-2.jpg', 'IRS Co-Lead. Spearheading corporate sponsorships, industry partnerships, and campus outreach.', NULL, NULL, 6, true, 2024)
ON CONFLICT (id) DO NOTHING;

