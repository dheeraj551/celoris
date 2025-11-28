import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';
import path from 'path';
import { promises as fs } from 'fs';

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const userId = formData.get('user_id') as string;
    const description = formData.get('description') as string || '';

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!videoFile.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'File must be a video' },
        { status: 400 }
      );
    }

    // Validate file size (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 500MB allowed.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = path.extname(videoFile.name);
    const uniqueFilename = `${generateUUID()}${fileExtension}`;
    
    // In a real implementation, you would:
    // 1. Upload to your VPS storage (AWS S3, Google Cloud, etc.)
    // 2. For demo, we'll simulate the upload
    
    // Simulate VPS storage upload
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    
    // Create directories if they don't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    const thumbnailDir = path.join(process.cwd(), 'uploads', 'thumbnails');
    
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.mkdir(thumbnailDir, { recursive: true });
    } catch (error) {
      console.log('Directories might already exist');
    }

    // Save video file (simulated VPS storage)
    const videoPath = path.join(uploadDir, uniqueFilename);
    await fs.writeFile(videoPath, buffer);

    // Generate video metadata (in real implementation, this would come from VPS)
    const videoMetadata = {
      duration: 30, // Simulated duration
      dimensions: { width: 1920, height: 1080 }, // Simulated dimensions
      size: videoFile.size
    };

    // Create VPS URL (in real implementation, this would be your VPS domain)
    const vpsUrl = `/uploads/videos/${uniqueFilename}`;
    
    // Save metadata to Supabase for reference
    const supabase = createClient();
    const { error: dbError } = await (supabase
      .from('vps_uploads_log') as any)
      .insert({
        user_id: userId,
        file_name: videoFile.name,
        file_size: videoFile.size,
        vps_path: vpsUrl,
        upload_status: 'completed',
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the upload if database insert fails
    }

    return NextResponse.json({
      success: true,
      vps_url: vpsUrl,
      file_name: uniqueFilename,
      original_name: videoFile.name,
      file_size: videoFile.size,
      duration: videoMetadata.duration,
      dimensions: videoMetadata.dimensions,
      upload_timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('VPS upload error:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to serve video files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path required' },
        { status: 400 }
      );
    }

    // Security check - only allow files from our upload directory
    if (!filePath.startsWith('/uploads/videos/')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      const fileBuffer = await fs.readFile(fullPath);
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'video/mp4', // You might want to detect this dynamically
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000', // 1 year cache
        },
      });
    } catch (fileError) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Video serving error:', error);
    return NextResponse.json(
      { error: 'Failed to serve video' },
      { status: 500 }
    );
  }
}