# Homeland Football Academy Backend

This is the Node.js/Express backend for the Homeland Football Academy management system.

## 🚀 Features
- **Authentication**: JWT-based auth with Refresh Tokens (Secure HTTP-only cookies recommended for future).
- **Applications**: Full CRUD for player applications with status tracking.
- **Videos**: Manage training videos and highlights.
- **Dashboard Stats**: Analytics for admin dashboard.
- **Email Notifications**: Integrated with Resend API.
- **Data Export**: Export applications to CSV.

## 🛠️ Tech Stack
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **Deployment**: Vercel Serverless Functions

## 📦 Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file based on the example:
   ```env
   NODE_ENV=development
   JWT_SECRET=your-secret
   RESEND_API_KEY=re_123...
   DATABASE_PATH=./database/academy.db
   ```

3. **Database Seeding**
   Initialize the database and create a Super Admin:
   ```bash
   npm run seed
   ```
   *Default Admin:* `admin@homelandfa.com` / `password123`

4. **Run Locally**
   ```bash
   npm run dev
   ```

## ☁️ Deployment on Vercel

### Important Note on SQLite & Serverless
Vercel functions have an **ephemeral filesystem**. This means any data written to the SQLite database **WILL BE LOST** when the function instance freezes or restarts. 

**For a persistent production environment:**
1. Use an external database like **Turso (LibSQL)**, **PostgreSQL (Neon/Supabase)**, or **MongoDB**.
2. OR deploy this backend to a traditional VPS (DigitalOcean, Railway, Render) where the filesystem is persistent.

### Deploy Steps
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` to deploy.
3. Add Environment Variables in Vercel Project Settings.

## 🧪 Testing
Run the comprehensive test suite to verify all endpoints:
```bash
node test_suite.js
```
