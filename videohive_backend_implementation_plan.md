# VideoHive Backend Implementation Plan

## 1. Project Overview

**VideoHive** is a short-form video sharing platform similar to TikTok. Users can register, upload videos, watch a personalized/global feed, like videos, comment, follow creators, save videos, and manage their profiles.

This backend will be built with:

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **Cloudinary** for image/video uploads
- **JWT authentication**

The first version should stay simple and avoid complex features like in-app chat, advanced recommendation engines, livestreaming, and creator monetization.

---

## 2. Main Backend Goals

The backend should support:

1. User authentication and account management
2. User profile management
3. Video upload and video metadata storage
4. Cloudinary media upload integration
5. Public video feed
6. Video likes, comments, saves/bookmarks
7. Follow/unfollow users
8. Basic search
9. Basic reporting/moderation structure
10. Admin-ready structure for future expansion

---

## 3. Suggested Tech Stack

### Core

```bash
express
mongoose
jsonwebtoken
bcryptjs
dotenv
cors
helmet
morgan
cookie-parser
express-rate-limit
```

### File Uploads and Cloudinary

```bash
cloudinary
multer
multer-storage-cloudinary
```

### Validation and Error Handling

```bash
joi
http-errors
express-async-errors
```

Alternative validation library:

```bash
zod
```

### Security and Utilities

```bash
xss-clean
mongo-sanitize
compression
slugify
nanoid
```

### Development

```bash
nodemon
eslint
prettier
```

### Optional but Useful Later

```bash
bullmq
ioredis
sharp
winston
```

BullMQ + Redis can be introduced later for background jobs such as video processing, notifications, email jobs, and analytics aggregation.

---

## 4. Suggested Folder Structure

```txt
src/
  config/
    db.js
    cloudinary.js
    env.js

  modules/
    auth/
      auth.controller.js
      auth.routes.js
      auth.service.js
      auth.validation.js

    users/
      user.model.js
      user.controller.js
      user.routes.js
      user.service.js
      user.validation.js

    videos/
      video.model.js
      video.controller.js
      video.routes.js
      video.service.js
      video.validation.js

    comments/
      comment.model.js
      comment.controller.js
      comment.routes.js
      comment.service.js

    likes/
      like.model.js
      like.controller.js
      like.routes.js
      like.service.js

    follows/
      follow.model.js
      follow.controller.js
      follow.routes.js
      follow.service.js

    bookmarks/
      bookmark.model.js
      bookmark.controller.js
      bookmark.routes.js
      bookmark.service.js

    reports/
      report.model.js
      report.controller.js
      report.routes.js
      report.service.js

  middlewares/
    auth.middleware.js
    error.middleware.js
    validate.middleware.js
    upload.middleware.js
    rateLimit.middleware.js

  utils/
    apiResponse.js
    AppError.js
    pagination.js
    cloudinaryUploader.js

  app.js
  server.js
```

---

## 5. Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/videohive

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:3000
```

---

## 6. Database Schemas

## 6.1 User Schema

```js
{
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 160
  },
  avatar: {
    url: String,
    publicId: String
  },
  coverImage: {
    url: String,
    publicId: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  videosCount: {
    type: Number,
    default: 0
  },
  lastLoginAt: Date
},
{
  timestamps: true
}
```

### Recommended Indexes

```js
username: 1
email: 1
createdAt: -1
```

---

## 6.2 Refresh Token Schema

```js
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenHash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  revokedAt: Date,
  userAgent: String,
  ipAddress: String
},
{
  timestamps: true
}
```

### Recommended Indexes

```js
userId: 1
expiresAt: 1
```

---

## 6.3 Video Schema

```js
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    maxlength: 2200,
    trim: true
  },
  video: {
    url: String,
    publicId: String,
    duration: Number,
    format: String,
    bytes: Number
  },
  thumbnail: {
    url: String,
    publicId: String
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['processing', 'published', 'failed', 'blocked'],
    default: 'published'
  },
  tags: [String],
  musicName: String,
  location: String,
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  sharesCount: {
    type: Number,
    default: 0
  },
  bookmarksCount: {
    type: Number,
    default: 0
  }
},
{
  timestamps: true
}
```

### Recommended Indexes

```js
userId: 1, createdAt: -1
visibility: 1, status: 1, createdAt: -1
tags: 1
caption: 'text'
```

---

## 6.4 Like Schema

```js
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  }
},
{
  timestamps: true
}
```

### Recommended Indexes

```js
{ userId: 1, videoId: 1 }, unique: true
videoId: 1
```

---

## 6.5 Comment Schema

```js
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  likesCount: {
    type: Number,
    default: 0
  },
  repliesCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
}
```

### Recommended Indexes

```js
videoId: 1, createdAt: -1
parentCommentId: 1
userId: 1
```

---

## 6.6 Follow Schema

```js
{
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  timestamps: true
}
```

### Recommended Indexes

```js
{ followerId: 1, followingId: 1 }, unique: true
followingId: 1
followerId: 1
```

---

## 6.7 Bookmark Schema

```js
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  }
},
{
  timestamps: true
}
```

### Recommended Indexes

```js
{ userId: 1, videoId: 1 }, unique: true
userId: 1, createdAt: -1
```

---

## 6.8 View Schema

For simple analytics, you can store video views separately.

```js
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  ipAddress: String,
  userAgent: String,
  watchedDuration: Number
},
{
  timestamps: true
}
```

### Recommended Indexes

```js
videoId: 1, createdAt: -1
userId: 1, videoId: 1
```

For the MVP, you can also avoid storing every view and simply increment `viewsCount` with some basic duplicate protection.

---

## 6.9 Report Schema

```js
{
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['video', 'comment', 'user'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reason: {
    type: String,
    enum: ['spam', 'harassment', 'nudity', 'violence', 'copyright', 'other'],
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed', 'action_taken'],
    default: 'pending'
  }
},
{
  timestamps: true
}
```

---

## 7. API Endpoint Plan

Base URL:

```txt
/api/v1
```

---

## 7.1 Auth Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh-token` | Refresh access token | No |
| POST | `/auth/logout` | Logout current device | Yes |
| POST | `/auth/logout-all` | Logout from all devices | Yes |
| GET | `/auth/me` | Get logged-in user | Yes |

### Register Payload

```json
{
  "username": "jesse",
  "email": "jesse@example.com",
  "password": "Password123!",
  "fullName": "Jesse"
}
```

---

## 7.2 User/Profile Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users/:username` | Get public user profile | Optional |
| PATCH | `/users/me` | Update profile details | Yes |
| PATCH | `/users/me/avatar` | Upload/update avatar | Yes |
| PATCH | `/users/me/cover` | Upload/update cover image | Yes |
| GET | `/users/:userId/videos` | Get user's public videos | Optional |
| GET | `/users/:userId/liked-videos` | Get liked videos | Yes |
| GET | `/users/:userId/followers` | Get followers | Optional |
| GET | `/users/:userId/following` | Get following | Optional |

---

## 7.3 Video Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/videos` | Upload/create video | Yes |
| GET | `/videos/feed` | Get public feed | Optional |
| GET | `/videos/following` | Get videos from followed users | Yes |
| GET | `/videos/:videoId` | Get single video | Optional |
| PATCH | `/videos/:videoId` | Update video caption/visibility | Yes, owner |
| DELETE | `/videos/:videoId` | Delete video | Yes, owner/admin |
| POST | `/videos/:videoId/view` | Register video view | Optional |
| POST | `/videos/:videoId/share` | Increment share count | Optional |

### Create Video Payload

This should use `multipart/form-data`.

```txt
video: file
thumbnail: file, optional
caption: string
tags: string[] or comma-separated string
visibility: public/private
musicName: string, optional
location: string, optional
```

### Feed Query Params

```txt
GET /api/v1/videos/feed?page=1&limit=20
```

For simple MVP feed logic:

- Return public videos
- Exclude blocked/failed videos
- Sort by `createdAt DESC`
- Later, add ranking based on likes/views/comments

---

## 7.4 Like Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/videos/:videoId/like` | Like a video | Yes |
| DELETE | `/videos/:videoId/like` | Unlike a video | Yes |
| GET | `/videos/:videoId/likes` | Get users who liked video | Optional |

Implementation rule:

- Create a `Like` document only once per user/video.
- Use a unique compound index on `{ userId, videoId }`.
- Increment/decrement `likesCount` on the video.

---

## 7.5 Comment Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/videos/:videoId/comments` | Add comment | Yes |
| GET | `/videos/:videoId/comments` | Get video comments | Optional |
| POST | `/comments/:commentId/replies` | Reply to comment | Yes |
| PATCH | `/comments/:commentId` | Update comment | Yes, owner |
| DELETE | `/comments/:commentId` | Delete comment | Yes, owner/admin |

Implementation rule:

- Use soft delete for comments.
- Do not remove comments permanently at first.
- When deleted, set `isDeleted = true` and hide the text.

---

## 7.6 Follow Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/users/:userId/follow` | Follow user | Yes |
| DELETE | `/users/:userId/follow` | Unfollow user | Yes |
| GET | `/users/:userId/follow-status` | Check if current user follows user | Yes |

Implementation rule:

- Prevent users from following themselves.
- Use unique index on `{ followerId, followingId }`.
- Increment/decrement `followersCount` and `followingCount`.

---

## 7.7 Bookmark Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/videos/:videoId/bookmark` | Save video | Yes |
| DELETE | `/videos/:videoId/bookmark` | Remove saved video | Yes |
| GET | `/me/bookmarks` | Get saved videos | Yes |

---

## 7.8 Search Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/search/users?q=keyword` | Search users | Optional |
| GET | `/search/videos?q=keyword` | Search videos | Optional |
| GET | `/search/tags?q=keyword` | Search tags | Optional |

Simple implementation:

- User search by username/fullName
- Video search by caption/tags
- Add MongoDB text indexes for simple search

---

## 7.9 Report Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/reports` | Report video/comment/user | Yes |
| GET | `/admin/reports` | Get reports | Admin |
| PATCH | `/admin/reports/:reportId` | Update report status | Admin |

---

## 7.10 Admin Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/users` | List users | Admin |
| PATCH | `/admin/users/:userId/status` | Activate/deactivate user | Admin |
| GET | `/admin/videos` | List videos | Admin |
| PATCH | `/admin/videos/:videoId/status` | Block/publish video | Admin |
| DELETE | `/admin/videos/:videoId` | Delete video | Admin |

Admin can be very basic for MVP.

---

## 8. Cloudinary Upload Plan

### Upload Types

| Media | Cloudinary Folder | Resource Type |
|---|---|---|
| User avatars | `videohive/avatars` | image |
| Cover images | `videohive/covers` | image |
| Videos | `videohive/videos` | video |
| Thumbnails | `videohive/thumbnails` | image |

### Upload Flow

1. User sends video using `multipart/form-data`.
2. Express receives file using `multer`.
3. File is uploaded to Cloudinary.
4. Cloudinary returns `secure_url`, `public_id`, `duration`, `format`, and `bytes`.
5. Backend stores metadata in MongoDB.
6. Backend returns created video response.

### Important Notes

- Validate file size before upload.
- Restrict accepted file types.
- Store `publicId` so files can be deleted from Cloudinary later.
- Delete old avatar/cover from Cloudinary when user replaces it.
- Delete video from Cloudinary when the video is deleted from the app.

---

## 9. Authentication Plan

Use access and refresh tokens.

### Access Token

- Short-lived
- Used to access protected endpoints
- Example expiry: 15 minutes

### Refresh Token

- Longer-lived
- Stored hashed in DB
- Used to generate new access tokens
- Example expiry: 7 days

### Password Handling

- Never store plain passwords.
- Hash password using `bcryptjs`.
- Minimum password length should be enforced.

---

## 10. Authorization Rules

| Action | Rule |
|---|---|
| Update profile | Logged-in user only |
| Upload video | Logged-in user only |
| Edit video | Video owner only |
| Delete video | Video owner or admin |
| Delete comment | Comment owner or admin |
| View public videos | Anyone |
| View private videos | Owner only |
| Admin actions | Admin only |

---

## 11. Pagination Standard

All list endpoints should support pagination.

Example:

```txt
GET /api/v1/videos/feed?page=1&limit=20
```

Response format:

```json
{
  "success": true,
  "message": "Videos fetched successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

For better performance later, cursor pagination can be introduced:

```txt
GET /api/v1/videos/feed?cursor=videoCreatedAtOrId&limit=20
```

---

## 12. Standard API Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

---

## 13. Middleware Plan

### Required Middleware

1. `authMiddleware`
   - Verifies JWT access token
   - Attaches current user to request

2. `optionalAuthMiddleware`
   - Reads user if token exists
   - Does not fail if no token is provided

3. `roleMiddleware`
   - Restricts routes by role

4. `validateMiddleware`
   - Validates request body, params, and query

5. `uploadMiddleware`
   - Handles file uploads

6. `errorMiddleware`
   - Centralized error response handler

7. `rateLimitMiddleware`
   - Protects auth and upload endpoints

---

## 14. Validation Plan

Validate all incoming requests.

Examples:

### Register

- username required
- email required and valid
- password required and strong enough
- fullName optional

### Create Video

- video file required
- caption optional but max length enforced
- visibility must be `public` or `private`
- tags must be limited

### Comment

- text required
- max length: 500 characters

---

## 15. Basic Feed Strategy

For MVP, keep feed simple.

### Public Feed

```js
Video.find({
  visibility: 'public',
  status: 'published'
})
.sort({ createdAt: -1 })
.limit(limit)
.skip(skip)
.populate('userId', 'username fullName avatar')
```

### Following Feed

1. Get IDs of users current user follows.
2. Fetch videos from those users.
3. Sort by newest.

Later, the feed can be improved with:

- Watch history
- Interests/tags
- Like behavior
- View duration
- Trending score
- Creator popularity

---

## 16. Notification Plan

For the simple version, notifications can be skipped or added as database-only notifications.

Possible future notifications:

- Someone liked your video
- Someone commented on your video
- Someone followed you
- Someone replied to your comment

Suggested future schema:

```js
{
  recipientId: ObjectId,
  actorId: ObjectId,
  type: 'like' | 'comment' | 'follow' | 'reply',
  entityType: 'video' | 'comment' | 'user',
  entityId: ObjectId,
  isRead: false
}
```

---

## 17. Security Checklist

1. Use `helmet`.
2. Use `cors` with allowed frontend domains.
3. Use `express-rate-limit` on auth routes.
4. Hash passwords with bcrypt.
5. Store refresh tokens hashed.
6. Validate all request bodies.
7. Sanitize MongoDB queries.
8. Limit file upload size.
9. Restrict file upload types.
10. Never expose Cloudinary API secret to frontend.
11. Use centralized error handling.
12. Avoid returning password hashes in responses.
13. Use environment variables for secrets.
14. Add request logging.
15. Use HTTPS in production.

---

## 18. MVP Implementation Phases

## Phase 1: Project Setup

- Initialize Express project
- Configure MongoDB connection
- Configure environment variables
- Add global error handling
- Add standard response helper
- Add validation middleware
- Add auth middleware

## Phase 2: Auth and Users

- User model
- Register endpoint
- Login endpoint
- Refresh token endpoint
- Logout endpoint
- Get current user endpoint
- Update profile endpoint
- Avatar upload endpoint

## Phase 3: Video Upload and Feed

- Configure Cloudinary
- Configure video upload middleware
- Create video model
- Upload video endpoint
- Get video feed endpoint
- Get single video endpoint
- Update video endpoint
- Delete video endpoint

## Phase 4: Social Features

- Like/unlike video
- Add/get/delete comments
- Follow/unfollow users
- Bookmark/unbookmark videos
- User profile videos

## Phase 5: Search and Reports

- Search users
- Search videos
- Search tags
- Report video/comment/user
- Basic admin report review

## Phase 6: Hardening and Deployment

- Add indexes
- Add rate limits
- Add request logging
- Add production CORS config
- Add Dockerfile if needed
- Add CI/CD pipeline if needed
- Add seed admin user script
- Add API documentation

---

## 19. Recommended First API Build Order

Build in this order to avoid confusion:

1. Project setup
2. DB connection
3. User schema
4. Auth routes
5. Auth middleware
6. Cloudinary config
7. Video schema
8. Video upload endpoint
9. Feed endpoint
10. Like endpoint
11. Comment endpoint
12. Follow endpoint
13. Bookmark endpoint
14. Search endpoint
15. Report/admin endpoint

---

## 20. API Documentation Plan

Use one of these:

```bash
swagger-ui-express
swagger-jsdoc
```

or maintain a simple Postman collection.

Suggested docs sections:

- Auth
- Users
- Videos
- Likes
- Comments
- Follows
- Bookmarks
- Search
- Reports
- Admin

---

## 21. Suggested Git Branching

```txt
main
  production-ready code

dev
  active development branch

feature/auth
feature/users
feature/videos
feature/comments
feature/follows
feature/search
feature/reports
```

---

## 22. Future Features

These should not be part of the first version unless required:

- In-app chat
- Live streaming
- Creator monetization
- Advanced recommendation engine
- AI moderation
- Video transcoding queue
- Push notifications
- Hashtag trending engine
- Audio/music library
- Duet/stitch functionality
- Creator analytics dashboard

---

## 23. Simple MVP Scope

For the first production-ready version, focus on:

1. Auth
2. Profiles
3. Video upload
4. Public feed
5. Likes
6. Comments
7. Follows
8. Bookmarks
9. Search
10. Reports

This is enough to validate the main product idea without overbuilding the platform too early.

---

## 24. Notes for Implementation Quality

- Keep controllers thin.
- Put business logic in services.
- Do not write raw logic directly inside route files.
- Use reusable middleware for auth, validation, errors, and uploads.
- Always store Cloudinary `publicId` with the file URL.
- Use MongoDB indexes early.
- Avoid returning too much data from list endpoints.
- Use pagination everywhere.
- Keep response shape consistent.
- Add admin support early, even if basic.

---

## 25. Final Recommended MVP Endpoint List

```txt
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

GET    /api/v1/users/:username
PATCH  /api/v1/users/me
PATCH  /api/v1/users/me/avatar
PATCH  /api/v1/users/me/cover
GET    /api/v1/users/:userId/videos

POST   /api/v1/videos
GET    /api/v1/videos/feed
GET    /api/v1/videos/following
GET    /api/v1/videos/:videoId
PATCH  /api/v1/videos/:videoId
DELETE /api/v1/videos/:videoId
POST   /api/v1/videos/:videoId/view

POST   /api/v1/videos/:videoId/like
DELETE /api/v1/videos/:videoId/like

POST   /api/v1/videos/:videoId/comments
GET    /api/v1/videos/:videoId/comments
POST   /api/v1/comments/:commentId/replies
PATCH  /api/v1/comments/:commentId
DELETE /api/v1/comments/:commentId

POST   /api/v1/users/:userId/follow
DELETE /api/v1/users/:userId/follow
GET    /api/v1/users/:userId/follow-status

POST   /api/v1/videos/:videoId/bookmark
DELETE /api/v1/videos/:videoId/bookmark
GET    /api/v1/me/bookmarks

GET    /api/v1/search/users
GET    /api/v1/search/videos
GET    /api/v1/search/tags

POST   /api/v1/reports
GET    /api/v1/admin/reports
PATCH  /api/v1/admin/reports/:reportId
```

---

## 26. Conclusion

The best approach for VideoHive is to build a clean MVP first, focusing on video upload, feed, user profiles, likes, comments, follows, and bookmarks.

Cloudinary should handle all multimedia uploads, while MongoDB stores users, video metadata, social interactions, and moderation records.

The backend should be structured in modules from the beginning, so the project can later grow into advanced features like recommendations, notifications, moderation, monetization, and analytics without needing a full rewrite.
