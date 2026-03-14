// Admin Authentication Middleware
// This file provides proper admin authentication for all admin API routes

import { NextRequest, NextResponse } from 'next/server'

// Admin authentication configuration
const ADMIN_CONFIG = {
  allowedEmails: [
    'support@celorisdesigns.com',
    'admin@celorisdesigns.com',
    // Add other admin emails here as needed
  ],
  adminRoles: ['admin', 'super_admin'],
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  adminFixedId: '550e8400-e29b-41d4-a716-446655440000'
}

/**
 * Admin authentication middleware
 * Supports both Supabase auth and localStorage session-based authentication
 */
export const authenticateAdmin = async (request: NextRequest) => {
  try {
    // Try Supabase authentication first
    const supabaseAuth = await trySupabaseAuth(request)
    if (supabaseAuth.success) {
      return supabaseAuth
    }

    // Fallback to localStorage session authentication
    const sessionAuth = await trySessionAuth(request)
    if (sessionAuth.success) {
      return sessionAuth
    }

    return {
      success: false,
      error: 'Authentication failed',
      status: 401
    }

  } catch (error) {
    console.error('Admin auth error:', error)
    return {
      success: false,
      error: 'Authentication error',
      status: 500
    }
  }
}

/**
 * Try Supabase authentication
 */
const trySupabaseAuth = async (request: NextRequest) => {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return { success: false, error: 'No authorization header' }
    }

    // For now, return not authenticated to use session-based auth
    // In production, implement proper JWT token validation
    return { success: false, error: 'Supabase auth not configured' }

  } catch (error) {
    return { success: false, error: 'Supabase auth failed' }
  }
}

/**
 * Try localStorage session authentication
 */
const trySessionAuth = async (request: NextRequest) => {
  try {
    // Get the session from headers only
    const session = request.headers.get('x-admin-session')

    if (!session) {
      return { success: false, error: 'No admin session header found' }
    }

    // Parse and validate session
    let parsedSession;
    try {
      parsedSession = JSON.parse(session)
    } catch (parseError) {
      return { success: false, error: 'Invalid session JSON format' }
    }
    
    // Check required fields
    if (!parsedSession.email || !parsedSession.timestamp) {
      return { success: false, error: 'Session missing required fields (email, timestamp)' }
    }

    // Check session age (allow some buffer for clock differences)
    const sessionAge = Date.now() - parsedSession.timestamp
    const maxAge = ADMIN_CONFIG.sessionTimeout + (5 * 60 * 1000) // 5 minute buffer
    if (sessionAge > maxAge) {
      return { success: false, error: `Session expired (${Math.round(sessionAge/1000/60)} minutes old)` }
    }

    // Check if email is in allowed admin emails
    const userEmail = parsedSession.email
    if (!ADMIN_CONFIG.allowedEmails.includes(userEmail)) {
      return { success: false, error: `User email "${userEmail}" not authorized as admin` }
    }

    // Ensure admin ID exists and is valid
    let adminId = parsedSession.id
    if (!adminId || adminId.length < 30) {
      adminId = ADMIN_CONFIG.adminFixedId
    }

    return {
      success: true,
      user: {
        id: adminId,
        email: userEmail,
        role: parsedSession.role || 'admin'
      },
      session: parsedSession
    }

  } catch (error) {
    console.error('Session authentication error:', error)
    return { success: false, error: 'Session authentication failed' }
  }
}

/**
 * Create unauthorized response
 */
export const createUnauthorizedResponse = (message: string = 'Unauthorized') => {
  return NextResponse.json(
    { error: message, code: 'UNAUTHORIZED' },
    { status: 401 }
  )
}

/**
 * Create error response
 */
export const createErrorResponse = (error: string, status: number = 500) => {
  return NextResponse.json(
    { error, code: 'SERVER_ERROR' },
    { status }
  )
}
