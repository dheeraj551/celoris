// Admin API Client
// Simple admin API using direct API calls - no complex session management

/**
 * Simple admin API functions
 */
export const simpleAdminApi = {
  createCourse: async (courseData: any) => {
    const response = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  },

  getCourses: async (params?: Record<string, string>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    const response = await fetch(`/api/admin/courses${queryString}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  },

  updateCourse: async (courseId: string, courseData: any) => {
    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  },

  deleteCourse: async (courseId: string) => {
    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }
}

// Backward compatibility
export const adminApi = simpleAdminApi

// Individual functions for backward compatibility
export const adminApiCall = simpleAdminApi.createCourse
