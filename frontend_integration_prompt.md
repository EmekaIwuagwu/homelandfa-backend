# System Prompt for Frontend AI (Lovable.dev / Cursor / Windsurf)

You are building the frontend for the **Homeland Football Academy** management system. 
Connect to the live backend API deployed at: `https://homelandfa-backend.onrender.com`

**Core Rules:**
1. **Base URL**: Prepend all requests with `https://homelandfa-backend.onrender.com/api`
2. **Auth Header**: For protected routes, include `Authorization: Bearer <token>` in headers.
3. **Error Handling**: Display `error` message from JSON response if status is not 2xx.

---

## 1. Authentication (Admin Panel)
**Context:** Used for the Admin Dashboard login page.

### Login
- **Endpoint**: `POST /auth/login`
- **Body**: `{ "email": "admin@homelandfa.com", "password": "password123" }`
- **Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbG...",     // Store this in localStorage
  "refreshToken": "7c9...", // Store this for refreshing
  "user": { "id": 1, "email": "...", "role": "super_admin" }
}
```

### Get Current User
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns current user details. Use this to validate session on app load.

---

## 2. Public Application Form
**Context**: The "Join Us" / Registration page for parents/players.

### Submit Application
- **Endpoint**: `POST /applications`
- **Headers**: Public (No auth needed)
- **Body**:
```json
{
  "player_name": "John Doe",
  "date_of_birth": "2010-05-20",
  "gender": "Male",
  "preferred_program": "Elite Squad", // Options: Development Squad, Elite Squad, Holiday Camp, Pre-Academy
  "parent_name": "Jane Doe",
  "phone": "08012345678",
  "email": "parent@example.com",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "08012345678"
}
```
- **Response**: `{ "message": "Application submitted successfully", "id": 15 }`

---

## 3. Admin Dashboard (Protected)
**Context**: Secure area for admins to view stats and manage applications.

### Dashboard Stats (Overview Widgets)
- **Endpoint**: `GET /stats/overview`
- **Response**:
```json
{
  "totalApplications": 150,
  "enrolled": 45,
  "pending": 10,
  "videos": 12,
  "recentApplications": [ ... ] 
}
```

### Charts Data
- **Monthly Trend**: `GET /stats/monthly-trend` (Line Chart)
- **By Program**: `GET /stats/applications-by-program` (Pie Chart)
- **Age Groups**: `GET /stats/age-distribution` (Bar Chart)

---

## 4. Application Management (Admin)
**Context**: The "Applications" table in the dashboard.

### List All Applications
- **Endpoint**: `GET /applications`
- **Query Params**: `?page=1&limit=20&status=pending&search=john`
- **Response**:
```json
{
  "data": [
    {
      "id": 1,
      "player_name": "John Doe",
      "status": "pending", // pending, approved, rejected, enrolled
      "preferred_program": "Elite Squad",
      "created_at": "2026-01-11 18:30:00"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### Update Status
- **Endpoint**: `PATCH /applications/:id/status`
- **Body**: `{ "status": "approved" }`
- **Response**: `{ "success": true, "message": "Status updated" }`

### Export Data
- **Endpoint**: `GET /applications/export`
- **Action**: Triggers a CSV file download.

---

## 5. Video Gallery
**Context**: "Training Drills" or "Highlights" page.

### Get Videos (Public)
- **Endpoint**: `GET /videos`
- **Query Params**: `?category=Training`
- **Response**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Ball Mastery",
      "youtube_url": "https://youtu.be/...",
      "thumbnail_url": "..."
    }
  ]
}
```

### Add Video (Admin)
- **Endpoint**: `POST /videos`
- **Body**:
```json
{
  "title": "New Drill",
  "description": "...",
  "category": "Training",
  "youtube_url": "https://..."
}
```
