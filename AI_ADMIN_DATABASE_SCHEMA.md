# AI Admin Agent - Complete Database Schema Specification

This document provides the exact table structures, column names, and API specifications that your AI admin agent needs to work with your database.

## 📋 Table Structures

### 1. **blog_posts** Table
**Primary Table**: `blog_posts` (NOT `blogs` or `articles`)

**Required Fields for Creation:**
```json
{
  "title": "string (required)",
  "content": "string (required)", 
  "slug": "string (optional)",
  "excerpt": "string (optional)",
  "featured_image_url": "string (optional)",
  "author_name": "string (optional, defaults to 'Admin')",
  "category": "string (optional, defaults to 'General')",
  "tags": "array of strings (optional)",
  "meta_title": "string (optional)",
  "meta_description": "string (optional)",
  "is_published": "boolean (defaults to true - auto-publishes all blogs)",
  "is_featured": "boolean (optional, defaults to false)",
  "status": "string (defaults to 'published')"
}
```

**API Endpoint**: `POST /api/admin/blog`
**Response Format**:
```json
{
  "success": true,
  "post": {
    "id": "uuid",
    "title": "string",
    "content": "string",
    "created_at": "timestamp",
    "is_published": true,
    "status": "published"
  }
}
```

**Get All Blogs**: `GET /api/admin/blog`
**Query Parameters**: `category`, `featured`, `search`, `page`, `limit`

---

### 2. **courses** Table  
**Primary Table**: `courses` (NOT `course_catalog`)

**Required Fields for Creation:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "subject": "string (required)",
  "level": "string (alternatively: grade_level)",
  "target_audience": "string (optional)",
  "instructor_name": "string (optional)", 
  "duration_weeks": "number (alternatively: course_duration as 'X weeks')",
  "price": "number (optional)",
  "course_image_url": "string (optional)",
  "is_published": "boolean (defaults to false)",
  "is_featured": "boolean (defaults to false)"
}
```

**API Endpoint**: `POST /api/admin/courses`
**Response Format**:
```json
{
  "course": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "subject": "string",
    "created_at": "timestamp"
  }
}
```

**Get All Courses**: `GET /api/admin/courses`
**Query Parameters**: `subject`, `published`, `featured`, `search`, `page`, `limit`

**Frontend Field Mappings**:
- `level` → `grade_level` in database
- `duration_weeks` → `course_duration` in format "X weeks"

---

### 3. **course_modules** Table
**Related to**: `courses` via `course_id`

**Required Fields for Creation:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "module_number": "number (required)",
  "estimated_duration": "string (optional)",
  "content": "string (optional)",
  "resources": "array (optional)"
}
```

**API Endpoint**: `POST /api/admin/courses/{course_id}/modules`
**Response Format**:
```json
{
  "module": {
    "id": "uuid",
    "title": "string",
    "module_number": "number",
    "course_id": "uuid"
  }
}
```

**Get Modules**: `GET /api/admin/courses/{course_id}/modules`

---

### 4. **course_topics** Table
**Related to**: `course_modules` via `module_id`

**Required Fields for Creation:**
```json
{
  "title": "string (required)",
  "short_description": "string (optional)",
  "order_in_module": "number (required)",
  "content": "string (optional)",
  "status": "string (optional)",
  "estimated_duration": "string (optional)",
  "resources": "array (optional)"
}
```

**API Endpoint**: `POST /api/admin/courses/{course_id}/modules/{module_id}/topics`
**Get Topics**: `GET /api/admin/courses/{course_id}/modules/{module_id}/topics`

---

### 5. **testimonials** Table

**Required Fields for Creation:**
```json
{
  "client_name": "string (required)",
  "testimonial_text": "string (required)",
  "client_title": "string (optional)",
  "client_company": "string (optional)",
  "client_avatar_url": "string (optional)",
  "rating": "number (defaults to 5)",
  "testimonial_type": "string (defaults to 'general')",
  "target_pages": "array of strings (defaults to ['homepage'])",
  "display_order": "number (defaults to 0)",
  "is_featured": "boolean (defaults to false)",
  "is_visible": "boolean (defaults to true)",
  "client_location": "string (optional)",
  "client_website": "string (optional)",
  "project_details": "string (optional)",
  "client_industry": "string (optional)",
  "date_received": "string (optional)",
  "verification_status": "string (defaults to 'pending')"
}
```

**API Endpoint**: `POST /api/admin/testimonials`
**Response Format**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "client_name": "string",
    "testimonial_text": "string",
    "is_visible": true
  },
  "message": "Testimonial created successfully"
}
```

**Get All Testimonials**: `GET /api/admin/testimonials`
**Query Parameters**: `type`, `featured`, `page`, `limit`

---

### 6. **jobs** Table

**Required Fields for Creation:**
```json
{
  "title": "string (required)",
  "company_name": "string (required)",
  "location": "string (required)",
  "description": "string (required)",
  "company_logo_url": "string (optional)",
  "is_remote": "boolean (optional, defaults to false)",
  "employment_type": "string (optional, defaults to 'full-time')",
  "experience_level": "string (optional, defaults to 'mid-level')",
  "salary_min": "number (optional)",
  "salary_max": "number (optional)",
  "salary_currency": "string (optional, defaults to 'USD')",
  "salary_period": "string (optional, defaults to 'year')",
  "requirements": "array of strings (optional)",
  "skills": "array of strings (optional)",
  "responsibilities": "array of strings (optional)",
  "benefits": "array of strings (optional)",
  "application_deadline": "string (optional)",
  "contact_email": "string (optional)",
  "application_url": "string (optional)",
  "is_featured": "boolean (optional, defaults to false)",
  "is_active": "boolean (optional, defaults to true)",
  "is_published": "boolean (optional, defaults to true)",
  "category": "string (optional)",
  "industry": "string (optional)",
  "company_size": "string (optional)",
  "remote_policy": "string (optional, defaults to 'hybrid')",
  "visa_sponsorship": "boolean (optional, defaults to false)",
  "years_required": "number (optional)",
  "education_required": "string (optional)",
  "language_requirements": "array of strings (optional)",
  "travel_required": "boolean (optional, defaults to false)",
  "department": "string (optional)",
  "seniority": "string (optional)",
  "reporting_to": "string (optional)",
  "team_size": "number (optional)",
  "tags": "array of strings (optional)",
  "status": "string (optional, defaults to 'active')",
  "urgency_level": "string (optional, defaults to 'normal')"
}
```

**API Endpoint**: `POST /api/admin/jobs`
**Response Format**:
```json
{
  "success": true,
  "message": "Job posting created successfully",
  "data": {
    "id": "uuid",
    "title": "string",
    "company_name": "string",
    "status": "active"
  }
}
```

**Get All Jobs**: `GET /api/admin/jobs`
**Query Parameters**: `type`, `level`, `remote`, `featured`, `category`, `page`, `limit`

---

### 7. **instagram_posts** Table

**Required Fields for Creation:**
```json
{
  "caption": "string (required)",
  "image_url": "string (required)",
  "post_type": "string (required)",
  "scheduled_time": "string (optional)",
  "is_published": "boolean (defaults to false)",
  "user_id": "uuid (for regular users)",
  "posted_at": "timestamp (auto-generated when published)"
}
```

**API Endpoints**:
- **GET** `/api/instagram-posts` (for regular users and admins)
- **POST** `/api/instagram-posts` (creates posts)
- **DELETE** `/api/instagram-posts/{id}` (deletes posts)
- **DELETE** `/api/instagram-posts/[id]/route.ts` (single post deletion)

**Authentication**: 
- **Regular Users**: Uses Supabase `auth.uid()`
- **Admin Users**: Uses `x-admin-session` header

---

## 🔍 API Response Formats

### Success Response Format
```json
{
  "success": true,
  "data": {
    // ... result data
  },
  "message": "Operation completed successfully"
}
```

### Error Response Format  
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error details (optional)"
}
```

### List Response Format (Paginated)
```json
{
  "success": true,
  "data": [
    // ... array of items
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

## 🔑 Key Field Mappings to Remember

### Frontend → Database Field Names:
- **Courses**:
  - `level` → `grade_level`
  - `duration_weeks` → `course_duration` (format: "X weeks")
  
- **Instagram Posts**:  
  - Uses Supabase auth for regular users
  - Uses `x-admin-session` for admin users

### Auto-Publishing Behavior:
- **Blogs**: Always auto-publish (`is_published: true`)
- **Status**: Always set to `'published'`
- **Testimonials**: Default visibility is `true`
- **Jobs**: Default publish state is `true` unless specified

---

## 📝 Quick Creation Examples

### Create a Blog Post:
```javascript
const blogData = {
  title: "How to Learn Programming",
  content: "Complete guide content here...",
  category: "Education",
  tags: ["programming", "tutorial"]
};
// POST /api/admin/blog
```

### Create a Course:
```javascript
const courseData = {
  title: "JavaScript Fundamentals", 
  description: "Learn the basics of JavaScript",
  subject: "Programming",
  level: "Beginner",
  duration_weeks: 8,
  price: 299
};
// POST /api/admin/courses  
```

### Create a Testimonial:
```javascript
const testimonialData = {
  client_name: "John Doe",
  testimonial_text: "Amazing course!",
  client_company: "Tech Corp",
  rating: 5,
  is_featured: true
};
// POST /api/admin/testimonials
```

---

## ⚠️ Important Notes for AI Agent

1. **Table Names**: Use exact names (`blog_posts`, not `blogs`)
2. **Required Fields**: Always validate required fields before API calls  
3. **Auto-Publishing**: Blogs are auto-published - don't override
4. **Authentication**: Use regular Supabase auth, not admin sessions
5. **Arrays**: Pass arrays for `tags`, `skills`, `requirements` etc.
6. **URLs**: Validate and format URLs properly (`featured_image_url`, `company_logo_url`)
7. **Validation**: Check for missing required fields before API calls

This specification ensures your AI admin agent can create, update, and manage content exactly as the frontend expects!