-- Database Schema for Football Academy Backend

-- 1. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Player Information
  player_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
  state_of_origin TEXT,
  lga TEXT,
  nationality TEXT DEFAULT 'Nigerian',
  
  -- Academic Information
  school TEXT,
  class_grade TEXT,
  
  -- Football Information
  preferred_program TEXT NOT NULL,
  preferred_position TEXT,
  preferred_foot TEXT CHECK(preferred_foot IN ('Left', 'Right', 'Both')),
  height REAL,
  weight REAL,
  previous_experience TEXT,
  video_link TEXT,
  
  -- Parent/Guardian Information
  parent_name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  occupation TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_relationship TEXT,
  
  -- Medical Information
  medical_conditions TEXT,
  allergies TEXT,
  current_medications TEXT,
  dietary_restrictions TEXT,
  
  -- Application Metadata
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'enrolled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_program ON applications(preferred_program);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

-- 2. Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);

-- 3. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);

-- 4. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  child_name TEXT,
  child_age INTEGER,
  program TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK(status IN ('unread', 'read', 'responded')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
