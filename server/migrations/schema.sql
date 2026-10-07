-- CALQIO Database Schema (PostgreSQL)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT '',
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Settings
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) DEFAULT '₹',
    decimals INTEGER DEFAULT 2,
    history_retention BOOLEAN DEFAULT TRUE,
    sound_effects BOOLEAN DEFAULT FALSE,
    theme VARCHAR(20) DEFAULT 'light',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories (14 Top-Level Categories)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100) DEFAULT 'grid',
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Domains / Subcategories (42 Domain Groups)
CREATE TABLE IF NOT EXISTS domains (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category_slug VARCHAR(100) REFERENCES categories(slug) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100) DEFAULT 'grid',
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Calculators Catalog
CREATE TABLE IF NOT EXISTS calculators (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category_slug VARCHAR(100) REFERENCES categories(slug) ON DELETE SET NULL,
    domain_slug VARCHAR(100) REFERENCES domains(slug) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    icon VARCHAR(100) DEFAULT 'calculator',
    tags TEXT[] DEFAULT '{}',
    popular_score INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Favorites
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    calculator_slug VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, calculator_slug)
);

-- 7. Calculation History
CREATE TABLE IF NOT EXISTS calculation_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    calculator_slug VARCHAR(100) NOT NULL,
    calc_name VARCHAR(255),
    expression TEXT,
    result TEXT,
    inputs_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Recently Used Calculators
CREATE TABLE IF NOT EXISTS recently_used (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    calculator_slug VARCHAR(100) NOT NULL,
    usage_count INTEGER DEFAULT 1,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, calculator_slug)
);

-- 9. Search History
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    query VARCHAR(255) NOT NULL,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    permissions TEXT[] DEFAULT '{"all"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_calculators_category ON calculators(category_slug);
CREATE INDEX IF NOT EXISTS idx_calculators_domain ON calculators(domain_slug);
CREATE INDEX IF NOT EXISTS idx_calculators_slug ON calculators(slug);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_history_user ON calculation_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recently_used_user ON recently_used(user_id, last_used_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
