# Quick Implementation Guide for AI Admin Agent

## 📋 What I've Discovered

Your frontend expects these **EXACT** table structures:

### 1. **blog_posts** table (NOT "blogs" or "articles")
- Frontend sends: `title`, `content`, `category`, `tags`, `is_published` 
- API: `POST /api/admin/blog`
- **Auto-publishes all blogs** (sets `is_published: true`)

### 2. **courses** table (NOT "course_catalog")  
- Frontend sends: `title`, `description`, `subject`, `level` → `grade_level`
- Frontend sends: `duration_weeks` → `course_duration` (format: "X weeks")
- API: `POST /api/admin/courses`

### 3. **testimonials** table
- Frontend sends: `client_name`, `testimonial_text`, `rating`, `is_featured`
- API: `POST /api/admin/testimonials`

### 4. **jobs** table  
- Frontend sends: `title`, `company_name`, `location`, `description`
- API: `POST /api/admin/jobs`

### 5. **course_modules** & **course_topics** tables
- Hierarchical structure: courses → modules → topics
- APIs: `/api/admin/courses/{id}/modules` and `/api/admin/courses/{id}/modules/{moduleId}/topics`

---

## 🔑 AI Agent Implementation Checklist

### Step 1: Database Field Mappings
```javascript
// Map frontend fields to database columns:
blog_posts: {
  // title, content, category, tags, is_featured → direct mapping
}

courses: {
  level → grade_level,
  duration_weeks → course_duration (format: "X weeks")
}

testimonials: {
  // Direct mapping: client_name, testimonial_text, rating, is_featured
}

jobs: {
  // Direct mapping with array fields: requirements, skills, responsibilities
}
```

### Step 2: API Endpoints to Call
```javascript
// Create Content:
POST /api/admin/blog          → Creates blog posts  
POST /api/admin/courses       → Creates courses
POST /api/admin/testimonials  → Creates testimonials
POST /api/admin/jobs          → Creates job postings

// Create Course Structure:
POST /api/admin/courses/{course_id}/modules        → Creates modules
POST /api/admin/courses/{course_id}/modules/{moduleId}/topics  → Creates topics

// Read Content:
GET /api/admin/blog?category=Education&featured=true
GET /api/admin/courses?subject=Programming&published=true
GET /api/admin/testimonials?featured=true
GET /api/admin/jobs?type=full-time&featured=true
```

### Step 3: Required Validation
```javascript
// Always validate these REQUIRED fields:
blog_posts:     title, content
courses:        title, description, subject  
testimonials:   client_name, testimonial_text
jobs:           title, company_name, location, description
course_modules: title, module_number
course_topics:  title, order_in_module
```

### Step 4: Auto-Setting Values
```javascript
// The frontend expects these auto-set values:
blog_posts:     is_published: true, status: "published"
courses:        is_published: false, is_featured: false (unless specified)
testimonials:   rating: 5, is_visible: true, target_pages: ["homepage"]
jobs:           is_active: true, is_published: true, employment_type: "full-time"
```

---

## 📝 Ready-to-Use API Examples

### Create Blog Post:
```javascript
const response = await fetch('/api/admin/blog', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Complete Guide to React",
    content: "Full tutorial content...",
    category: "Programming",
    tags: ["react", "javascript", "frontend"]
  })
});
```

### Create Course:
```javascript
const response = await fetch('/api/admin/courses', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "React Masterclass",
    description: "Build modern web applications",
    subject: "Web Development", 
    level: "Intermediate",
    duration_weeks: 12,
    price: 399
  })
});
```

### Create Course Module:
```javascript
const response = await fetch('/api/admin/courses/{course_id}/modules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Introduction to React",
    description: "Basics and setup",
    module_number: 1,
    estimated_duration: "2 weeks"
  })
});
```

### Create Course Topic:
```javascript
const response = await fetch('/api/admin/courses/{course_id}/modules/{module_id}/topics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "JSX Syntax",
    short_description: "Understanding JSX",
    order_in_module: 1,
    content: "JSX tutorial content..."
  })
});
```

---

## 🚀 Implementation Steps

1. **Use the detailed schema** in `AI_ADMIN_DATABASE_SCHEMA.md`
2. **Follow the exact field mappings** (level → grade_level, etc.)
3. **Validate required fields** before each API call
4. **Use correct API endpoints** for each table
5. **Handle arrays properly** (tags, skills, requirements)
6. **Validate URLs** (featured_image_url, company_logo_url)
7. **Test each API call** with the response formats shown

Your AI admin agent now has everything needed to work seamlessly with your frontend!