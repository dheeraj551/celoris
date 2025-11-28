"use client";

import React from 'react';
import InstagramManager from '@/components/InstagramManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Cloud, 
  Zap, 
  Shield,
  Heart,
  MessageCircle,
  Eye,
  Upload
} from 'lucide-react';

export default function InstagramDemo() {
  // Mock session data for demo purposes
  const mockSession = {
    id: 'demo-user-id',
    email: 'demo@example.com',
    user_metadata: {
      full_name: 'Demo User'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Video className="h-10 w-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              Instagram-Style VPS Video Platform
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Create your own Instagram-style video platform with unlimited VPS storage. 
            Upload, stream, and engage with your audience using our high-performance infrastructure.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Cloud className="h-4 w-4 mr-1" />
              VPS Storage
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Zap className="h-4 w-4 mr-1" />
              High Performance
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Shield className="h-4 w-4 mr-1" />
              No Limitations
            </Badge>
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">❌ Instagram Embed Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Instagram blocks inline video playback in embeds</li>
                <li>• Users forced to open videos on Instagram</li>
                <li>• Limited storage on social platforms</li>
                <li>• No custom branding or interface control</li>
                <li>• Dependent on Instagram's policies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">✅ Our VPS Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Custom Instagram-style interface</li>
                <li>• Unlimited VPS storage capacity</li>
                <li>• Full control over video playback</li>
                <li>• High-performance streaming</li>
                <li>• Independent of platform restrictions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 h-6 text-blue-500" />
              VPS Video Management
            </CardTitle>
            <CardDescription>
              Upload videos directly to your dedicated VPS storage. Create Instagram-style experiences without limitations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstagramManager user={mockSession} />
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-500" />
                Easy Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Drag and drop video files. Our AI agent backend automatically processes and optimizes your content on high-performance VPS servers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                Instagram-Style Player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Custom video player with like, comment, and share features. Fully responsive and optimized for all devices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Lightning Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                VPS-powered streaming with global CDN. Your videos load instantly regardless of user location or device.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Specifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Technical Advantages</CardTitle>
            <CardDescription>
              Why VPS storage beats traditional social platform limitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">VPS Storage Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Unlimited Storage:</strong> No file size or storage limits</li>
                  <li>• <strong>High Bandwidth:</strong> Fast uploads and downloads</li>
                  <li>• <strong>Custom Configuration:</strong> Optimized for video streaming</li>
                  <li>• <strong>Independent Infrastructure:</strong> Not affected by social platform changes</li>
                  <li>• <strong>Full Control:</strong> Complete ownership of your content</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Integration Features</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Supabase Metadata:</strong> Video info stored in database</li>
                  <li>• <strong>Real-time Analytics:</strong> View counts, likes, comments</li>
                  <li>• <strong>Privacy Controls:</strong> Public, followers-only, private</li>
                  <li>• <strong>Auto Thumbnails:</strong> AI-generated preview images</li>
                  <li>• <strong>Mobile Optimized:</strong> Works perfectly on all devices</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>
              Real-time metrics from our VPS infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">∞</div>
                <div className="text-sm text-gray-600">Storage Limit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1Gbps</div>
                <div className="text-sm text-gray-600">Upload Speed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">&lt;100ms</div>
                <div className="text-sm text-gray-600">Latency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}