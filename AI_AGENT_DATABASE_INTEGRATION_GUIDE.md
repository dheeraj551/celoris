# AI AGENT DATABASE INTEGRATION GUIDE

## 🎯 **PURPOSE**
This document provides complete database specifications and admin operations for your AI agent to handle all admin functionality directly, avoiding frontend authentication complexity.

---

## 🗄️ **DATABASE CONNECTION**

### **Supabase Connection Details:**
```javascript
// Database Connection
SUPABASE_URL: https://suaqywhmaheoansrinzw.supabase.co
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTUxMDAsImV4cCI6MjA3ODc5MTEwMH0.UBkJ-Cx6fRNQucvSQS47XY2Nn6ktj_pZQRa7UiTQhf4
SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIxNTEwMCwiZXhwIjoyMDc4NzkxMTAwfQ.8Y8Y6Zf7n5TqH6sZb8cE1mI4sC6f5V2W8j9l3N5Q6f

// Admin User (Fixed UUID)
ADMIN_USER_ID: 550e8400-e29b-41d4-a716-446655440000
ADMIN_EMAILS: ['support@celorisdesigns.com', 'admin@celorisdesigns.com']
```

### **Connection Setup:**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role for admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

---

## 📊 **DATABASE SCHEMA**

### **1. COURSES TABLE**
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  target_audience TEXT,
  instructor_name TEXT,
  instructor_bio TEXT,
  course_duration TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  course_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2. COURSE_MODULES TABLE**
```sql
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration INTEGER DEFAULT 60, -- minutes
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, module_number)
);
```

### **3. COURSE_TOPICS TABLE**
```sql
CREATE TABLE course_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  order_in_module INTEGER NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  full_content TEXT,
  content_type TEXT DEFAULT 'text', -- 'text', 'video', 'quiz', 'assignment'
  estimated_duration INTEGER DEFAULT 30, -- minutes
  status TEXT DEFAULT 'draft', -- 'draft', 'content_generated', 'published', 'archived'
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **4. INSTAGRAM_POSTS TABLE**
```sql
CREATE TABLE instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  instagram_url TEXT NOT NULL,
  instagram_post_id TEXT,
  caption TEXT,
  embed_html TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **5. USER_PROFILES TABLE**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 **DATABASE FUNCTIONS**

### **1. INSTAGRAM POST CREATION**
```sql
CREATE OR REPLACE FUNCTION create_instagram_post(
    p_instagram_url TEXT,
    p_user_id UUID
)
RETURNS JSON AS $$
DECLARE
    post_id UUID;
    extracted_instagram_id TEXT;
    final_user_id UUID;
BEGIN
    -- Validate inputs
    IF p_instagram_url IS NULL OR length(trim(p_instagram_url)) = 0 THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Instagram URL is required'
        );
    END IF;
    
    IF p_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'User ID is required'
        );
    END IF;
    
    -- Extract Instagram post ID
    extracted_instagram_id := extract_instagram_id(p_instagram_url);
    
    IF extracted_instagram_id IS NULL THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Invalid Instagram URL format'
        );
    END IF;
    
    -- Use admin fixed ID
    final_user_id := '550e8400-e29b-41d4-a716-446655440000';
    
    -- Check if post already exists
    IF EXISTS (SELECT 1 FROM public.instagram_posts 
               WHERE instagram_post_id = extracted_instagram_id) THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Post with this URL already exists'
        );
    END IF;
    
    -- Insert the post
    INSERT INTO public.instagram_posts (
        id,
        user_id,
        instagram_url,
        instagram_post_id,
        caption,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        final_user_id,
        p_instagram_url,
        extracted_instagram_id,
        NULL,
        NOW(),
        NOW()
    ) RETURNING id INTO post_id;
    
    RETURN json_build_object(
        'success', true, 
        'post_id', post_id,
        'instagram_id', extracted_instagram_id
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false, 
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **2. EXTRACT INSTAGRAM ID**
```sql
CREATE OR REPLACE FUNCTION extract_instagram_id(url TEXT)
RETURNS TEXT AS $$
DECLARE
    post_id TEXT;
BEGIN
    -- Handle different Instagram URL formats
    IF url ~ 'instagram\.com/p/([A-Za-z0-9_-]+)' THEN
        post_id := substring(url from 'instagram\.com/p/([A-Za-z0-9_-]+)');
    ELSIF url ~ 'instagram\.com/reel/([A-Za-z0-9_-]+)' THEN
        post_id := substring(url from 'instagram\.com/reel/([A-Za-z0-9_-]+)');
    ELSIF url ~ 'instagram\.com/tv/([A-Za-z0-9_-]+)' THEN
        post_id := substring(url from 'instagram\.com/tv/([A-Za-z0-9_-]+)');
    ELSE
        post_id := substring(url from '[A-Za-z0-9_-]{10,}');
    END IF;
    
    RETURN post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🤖 **AI AGENT OPERATIONS**

### **1. COURSE MANAGEMENT**

#### **Create Course:**
```javascript
const createCourse = async (courseData) => {
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: courseData.title,
      description: courseData.description,
      subject: courseData.subject,
      grade_level: courseData.grade_level,
      target_audience: courseData.target_audience,
      instructor_name: courseData.instructor_name,
      instructor_bio: courseData.instructor_bio,
      course_duration: courseData.course_duration,
      price: courseData.price,
      course_image_url: courseData.course_image_url,
      is_published: courseData.is_published || false,
      is_featured: courseData.is_featured || false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

#### **Update Course:**
```javascript
const updateCourse = async (courseId, updates) => {
  const { data, error } = await supabase
    .from('courses')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', courseId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

#### **Delete Course:**
```javascript
const deleteCourse = async (courseId) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  if (error) throw error;
  return { success: true };
};
```

#### **Get Courses:**
```javascript
const getCourses = async (filters = {}) => {
  let query = supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.subject) {
    query = query.eq('subject', filters.subject);
  }
  if (filters.published !== undefined) {
    query = query.eq('is_published', filters.published);
  }
  if (filters.featured !== undefined) {
    query = query.eq('is_featured', filters.featured);
  }
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};
```

### **2. MODULE MANAGEMENT**

#### **Create Module:**
```javascript
const createModule = async (courseId, moduleData) => {
  const { data, error } = await supabase
    .from('course_modules')
    .insert({
      course_id: courseId,
      module_number: moduleData.module_number,
      title: moduleData.title,
      description: moduleData.description,
      estimated_duration: moduleData.estimated_duration,
      is_published: moduleData.is_published || false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

#### **Update Module:**
```javascript
const updateModule = async (moduleId, updates) => {
  const { data, error } = await supabase
    .from('course_modules')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', moduleId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### **3. TOPIC MANAGEMENT**

#### **Create Topic:**
```javascript
const createTopic = async (moduleId, topicData) => {
  const { data, error } = await supabase
    .from('course_topics')
    .insert({
      course_module_id: moduleId,
      order_in_module: topicData.order_in_module,
      title: topicData.title,
      short_description: topicData.short_description,
      full_content: topicData.full_content,
      content_type: topicData.content_type || 'text',
      estimated_duration: topicData.estimated_duration,
      status: topicData.status || 'draft',
      is_free_preview: topicData.is_free_preview || false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### **4. INSTAGRAM MANAGEMENT**

#### **Create Instagram Post:**
```javascript
const createInstagramPost = async (url) => {
  const { data, error } = await supabase
    .rpc('create_instagram_post', {
      p_instagram_url: url,
      p_user_id: '550e8400-e29b-41d4-a716-446655440000'
    });

  if (error) throw error;
  return data;
};
```

#### **Get Instagram Posts:**
```javascript
const getInstagramPosts = async () => {
  const { data, error } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('user_id', '550e8400-e29b-41d4-a716-446655440000')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
```

#### **Delete Instagram Post:**
```javascript
const deleteInstagramPost = async (postId) => {
  const { error } = await supabase
    .from('instagram_posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', '550e8400-e29b-41d4-a716-446655440000');

  if (error) throw error;
  return { success: true };
};
```

---

## 📋 **AI AGENT COMMAND INTERFACE**

### **Course Management Commands:**
```typescript
interface CourseCommand {
  action: 'create_course' | 'update_course' | 'delete_course' | 'get_courses' | 'get_course';
  parameters: {
    course_id?: string;
    title?: string;
    subject?: 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'English' | 'Computer Science';
    grade_level?: string;
    description?: string;
    target_audience?: string;
    instructor_name?: string;
    instructor_bio?: string;
    course_duration?: string;
    price?: number;
    course_image_url?: string;
    is_published?: boolean;
    is_featured?: boolean;
    filters?: {
      subject?: string;
      published?: boolean;
      featured?: boolean;
      search?: string;
    };
  };
}
```

### **Module Management Commands:**
```typescript
interface ModuleCommand {
  action: 'create_module' | 'update_module' | 'delete_module' | 'get_modules';
  parameters: {
    course_id: string;
    module_id?: string;
    module_number?: number;
    title?: string;
    description?: string;
    estimated_duration?: number;
    is_published?: boolean;
  };
}
```

### **Instagram Management Commands:**
```typescript
interface InstagramCommand {
  action: 'create_post' | 'delete_post' | 'get_posts';
  parameters: {
    post_id?: string;
    url?: string;
    caption?: string;
  };
}
```

---

## 🔐 **SECURITY CONSIDERATIONS**

### **1. Use Service Role Key:**
```javascript
// Always use service role key for admin operations
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

### **2. Input Validation:**
```javascript
const validateCourseData = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (!data.subject || !['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'].includes(data.subject)) {
    errors.push('Invalid subject');
  }
  
  if (data.price < 0) {
    errors.push('Price cannot be negative');
  }
  
  return errors;
};
```

### **3. Rate Limiting:**
```javascript
// Implement rate limiting for admin operations
const rateLimiter = new Map();

const checkRateLimit = (operation, limit = 10, windowMs = 60000) => {
  const key = `${operation}_${Date.now()}`;
  const count = rateLimiter.get(operation) || 0;
  
  if (count >= limit) {
    throw new Error(`Rate limit exceeded for ${operation}`);
  }
  
  rateLimiter.set(operation, count + 1);
  return true;
};
```

---

## 📊 **RESPONSE FORMATS**

### **Success Response:**
```json
{
  "success": true,
  "data": {
    // operation result
  },
  "message": "Operation completed successfully"
}
```

### **Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // additional error details
  }
}
```

### **Pagination Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🚀 **INTEGRATION EXAMPLE**

### **Complete AI Agent Implementation:**
```javascript
class AdminAIAgent {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async executeCommand(command) {
    try {
      switch (command.action) {
        case 'create_course':
          return await this.createCourse(command.parameters);
        case 'update_course':
          return await this.updateCourse(command.parameters);
        case 'delete_course':
          return await this.deleteCourse(command.parameters);
        case 'get_courses':
          return await this.getCourses(command.parameters);
        case 'create_instagram_post':
          return await this.createInstagramPost(command.parameters);
        // ... other operations
        default:
          throw new Error(`Unknown command: ${command.action}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'COMMAND_EXECUTION_ERROR'
      };
    }
  }

  async createCourse(params) {
    const validationErrors = validateCourseData(params);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    const courseData = {
      ...params,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: courseData,
      message: `Course "${courseData.title}" created successfully`
    };
  }

  // ... other methods
}

// Usage
const agent = new AdminAIAgent();

// Example commands
const commands = [
  {
    action: 'create_course',
    parameters: {
      title: 'Advanced Mathematics',
      subject: 'Mathematics',
      grade_level: 'Class 12th CBSE',
      description: 'Comprehensive mathematics course',
      target_audience: 'Class 12 students',
      price: 1999,
      is_published: false
    }
  },
  {
    action: 'create_instagram_post',
    parameters: {
      url: 'https://www.instagram.com/p/abc123/',
      caption: 'New course launch!'
    }
  }
];

// Execute commands
for (const command of commands) {
  const result = await agent.executeCommand(command);
  console.log(result);
}
```

---

## ✅ **CHECKLIST FOR AI AGENT DEVELOPMENT**

### **Required Functions:**
- [ ] Database connection with service role
- [ ] Course CRUD operations
- [ ] Module CRUD operations  
- [ ] Topic CRUD operations
- [ ] Instagram post management
- [ ] Input validation
- [ ] Error handling
- [ ] Response formatting
- [ ] Rate limiting
- [ ] Logging

### **Testing Requirements:**
- [ ] Create test course
- [ ] Update course details
- [ ] Delete course
- [ ] Create Instagram post
- [ ] Delete Instagram post
- [ ] Get filtered courses
- [ ] Handle validation errors
- [ ] Handle database errors

### **Documentation:**
- [ ] API command reference
- [ ] Database schema documentation
- [ ] Error code reference
- [ ] Usage examples
- [ ] Security guidelines

---

This comprehensive guide provides everything your AI agent needs to handle all admin operations directly through the database, completely avoiding the frontend authentication complexity that's been causing issues.