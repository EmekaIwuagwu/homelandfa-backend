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
- **Database**: SQLite (via `better-sqlite3` and `@libsql/client` for cloud)
- **Deployment**: Vercel Serverless Functions or Render

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
   # For Cloud DB (optional):
   # DATABASE_URL=libsql://...
   # TURSO_AUTH_TOKEN=...
   ```

3. **Database Seeding**
   The database automatically seeds on startup if tables or admin are missing.
   *Default Admin:* `admin@homelandfa.com` / `password123`

4. **Run Locally**
   ```bash
   npm run dev
   ```

## ☁️ Deployment

### Render (Recommended for Persistence)
1. Push to GitHub.
2. Create Web Service on Render.
3. Add `DATABASE_URL` and `TURSO_AUTH_TOKEN` (for Turso) OR rely on local disk (non-persistent on free tier).

### Vercel (Serverless)
**Important:** Use an external database like **Turso (LibSQL)** for persistence.
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel`.
3. Add Environment Variables in Vercel.

## 🧪 Testing
Run the comprehensive test suite:
```bash
node test_suite.js
```
