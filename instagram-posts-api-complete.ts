// Instagram Posts API Endpoint - /pages/api/instagram-posts.ts
// This is the actual API endpoint that your frontend is calling

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-session');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Instagram posts API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// GET /api/instagram-posts - Retrieve all Instagram posts
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Call our database function
    const { data, error } = await supabase.rpc('get_instagram_posts');
    
    if (error) {
      console.error('Get Instagram posts error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve Instagram posts',
        details: error.message 
      });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Get posts catch error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve Instagram posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// POST /api/instagram-posts - Create new Instagram post
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { instagram_url } = req.body;
    
    // Validate input
    if (!instagram_url) {
      return res.status(400).json({ 
        success: false, 
        error: 'Instagram URL is required' 
      });
    }
    
    // Validate Instagram URL format
    if (!instagram_url.includes('instagram.com')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid Instagram URL' 
      });
    }
    
    // Call our database function to create the post
    const { data, error } = await supabase.rpc('create_instagram_post', {
      p_instagram_url: instagram_url
    });
    
    if (error) {
      console.error('Create Instagram post error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save Instagram post',
        details: error.message 
      });
    }
    
    return res.status(201).json(data);
  } catch (error) {
    console.error('Create post catch error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save Instagram post',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// DELETE /api/instagram-posts?id=uuid - Delete Instagram post
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const postId = req.query.id as string;
    
    if (!postId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Post ID is required' 
      });
    }
    
    // Call our database function to delete the post
    const { data, error } = await supabase.rpc('delete_instagram_post', {
      p_post_id: postId
    });
    
    if (error) {
      console.error('Delete Instagram post error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to delete Instagram post',
        details: error.message 
      });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Delete post catch error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete Instagram post',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
