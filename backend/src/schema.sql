CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'STORE_OWNER');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(60) NOT NULL CHECK (length(name) >= 2), -- Rule: 20-60 Characters
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,                        -- Rule: Max 400 Characters
    role user_role DEFAULT 'USER',
    status account_status DEFAULT 'ACTIVE',
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verify_token VARCHAR(255),
    email_verify_expiry TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_expiry TIMESTAMP,
    refresh_token TEXT,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Append this to your existing schema.sql file

-- 1. Create Stores Table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL, -- Enforces max 400 character address rule
    owner_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL, -- Connects to a Store Owner account
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Ratings Table (Must handle 1 to 5 values exclusively)
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Rule: Ratings range 1 to 5
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Normal user leaving the rating
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE, -- Destination store profile
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Crucial Rule: Enforces that a single normal user can only submit one rating per store
    UNIQUE (user_id, store_id)
);