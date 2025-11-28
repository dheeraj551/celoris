// FIXED Admin API Client
// This fixes the authentication issues by properly sending session headers

/**
 * Get admin session from localStorage
 */
export const getAdminSession = () => {
  try {
    const session = localStorage.getItem('admin_session')
    if (!session) return null

    const parsedSession = JSON.parse(session)
    const sessionAge = Date.now() - parsedSession.timestamp
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    if (sessionAge > maxAge) {
      localStorage.removeItem('admin_session')
      return null
    }

    return parsedSession
  } catch (error) {
    console.error('Error getting admin session:', error)
    return null
  }
}

/**
 * Create proper authenticated headers for API calls
 */
const createAuthHeaders = () => {
  const adminSession = getAdminSession()
  
  if (!adminSession) {
    throw new Error('No admin session found. Please log in again.')
  }

  return {
    'Content-Type': 'application/json',
    'x-admin-session': JSON.stringify(adminSession)
  }
}

/**
 * Make authenticated admin API call with proper headers
 */
export const adminApiCall = async (endpoint: string, options: RequestInit = {}) => {
  const session = getAdminSession()
  
  if (!session) {
    throw new Error('No admin session found. Please log in again.')
  }

  // Create headers (no session in body!)
  const headers = createAuthHeaders()

  const finalOptions: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...headers,
      ...options.headers
    },
    credentials: 'include'
  }

  // Add body only for POST/PUT requests (without duplicating session)
  if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
    finalOptions.body = options.body
  }

  console.log(`Making ${finalOptions.method} request to ${endpoint}`)
  console.log('Headers:', finalOptions.headers)

  const response = await fetch(endpoint, finalOptions)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      endpoint,
      error: errorData
    })
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('API Success:', { endpoint, data })
  return data
}

/**
 * Fixed Admin API methods
 */
export const adminApi = {
  // Courses - Fixed to use proper headers
  getCourses: (params?: Record<string, string>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return adminApiCall(`/api/admin/courses${queryString}`)
  },

  createCourse: (courseData: any) => {
    return adminApiCall('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData) // Body only contains course data, not session
    })
  },

  updateCourse: (courseId: string, courseData: any) => {
    return adminApiCall(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData) // Body only contains course data, not session
    })
  },

  deleteCourse: (courseId: string) => {
    return adminApiCall(`/api/admin/courses/${courseId}`, {
      method: 'DELETE'
    })
  },

  // Modules - Fixed to use proper headers
  createModule: (courseId: string, moduleData: any) => {
    return adminApiCall(`/api/admin/courses/${courseId}/modules`, {
      method: 'POST',
      body: JSON.stringify(moduleData)
    })
  },

  updateModule: (courseId: string, moduleId: string, moduleData: any) => {
    return adminApiCall(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify(moduleData)
    })
  },

  deleteModule: (courseId: string, moduleId: string) => {
    return adminApiCall(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
      method: 'DELETE'
    })
  },

  // Topics - Fixed to use proper headers
  createTopic: (courseId: string, moduleId: string, topicData: any) => {
    return adminApiCall(`/api/admin/courses/${courseId}/modules/${moduleId}/topics`, {
      method: 'POST',
      body: JSON.stringify(topicData)
    })
  },

  updateTopic: (courseId: string, moduleId: string, topicId: string, topicData: any) => {
    return adminApiCall(`/api/admin/courses/${courseId}/modules/${moduleId}/topics/${topicId}`, {
      method: 'PUT',
      body: JSON.stringify(topicData)
    })
  },

  deleteTopic: (courseId: string, moduleId: string, topicId: string) => {
    return adminApiCall(`/api/admin/courses/${courseId}/modules/${moduleId}/topics/${topicId}`, {
      method: 'DELETE'
    })
  }
}

/**
 * Instagram API helper (using same pattern)
 */
export const instagramApi = {
  getPosts: () => {
    return adminApiCall('/api/instagram-posts')
  },

  createPost: (postUrl: string) => {
    return adminApiCall('/api/instagram-posts', {
      method: 'POST',
      body: JSON.stringify({ postUrl })
    })
  },

  deletePost: (postId: string) => {
    return adminApiCall(`/api/instagram-posts?id=${postId}`, {
      method: 'DELETE'
    })
  }
}

/**
 * Utility to check if admin is logged in
 */
export const isAdminLoggedIn = () => {
  return getAdminSession() !== null
}

/**
 * Utility to get admin info
 */
export const getAdminInfo = () => {
  const session = getAdminSession()
  if (!session) return null
  
  return {
    email: session.email,
    role: session.role || 'admin',
    loginTime: new Date(session.timestamp),
    sessionAge: Math.round((Date.now() - session.timestamp) / (1000 * 60)) // minutes
  }
}