export interface Database {
  public: {
    Tables: {
      // Public shared tables
      testimonials: {
        Row: {
          id: string
          client_name: string
          client_title: string | null
          client_company: string | null
          client_avatar_url: string | null
          testimonial_text: string
          rating: number
          testimonial_type: 'general' | 'service' | 'product' | 'feature' | 'support'
          target_pages: string[]
          display_order: number
          is_featured: boolean
          is_visible: boolean
          client_location: string | null
          client_website: string | null
          project_details: any | null
          client_industry: string | null
          date_received: string | null
          verification_status: 'pending' | 'verified' | 'pending_review'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      settings: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: string
          notifications_enabled: boolean
          email_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['settings']['Insert']>
      }
      courses: {
        Row: {
          id: string
          title: string
          subject: string
          grade_level: string
          description: string
          target_audience: string
          instructor_name: string | null
          instructor_bio: string | null
          course_duration: string | null
          price: number
          course_image_url: string | null
          is_published: boolean
          is_featured: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      instagram_posts: {
        Row: {
          id: string
          instagram_url: string
          embed_html: string
          thumbnail_url: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['instagram_posts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['instagram_posts']['Insert']>
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          module_number: number
          title: string
          description: string | null
          estimated_duration: number | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['course_modules']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['course_modules']['Insert']>
      }
      course_topics: {
        Row: {
          id: string
          module_id: string
          order_in_module: number
          title: string
          short_description: string
          full_content: string | null
          content_type: string
          estimated_duration: number | null
          status: 'draft' | 'content_generated' | 'published' | 'archived'
          is_free_preview: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['course_topics']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['course_topics']['Insert']>
      }
      course_enrollments: {
        Row: {
          id: string
          course_id: string
          user_id: string | null
          enrollment_date: string
          completion_date: string | null
          progress_percentage: number
          last_accessed_at: string
          status: 'enrolled' | 'in_progress' | 'completed' | 'paused' | 'dropped'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['course_enrollments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['course_enrollments']['Insert']>
      }
      topic_progress: {
        Row: {
          id: string
          enrollment_id: string
          topic_id: string
          status: 'not_started' | 'started' | 'completed' | 'skipped'
          time_spent: number
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['topic_progress']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['topic_progress']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image_url: string | null
          author_name: string
          category: string
          tags: string[]
          meta_title: string | null
          meta_description: string | null
          reading_time: number
          is_published: boolean
          is_featured: boolean
          status: 'draft' | 'review' | 'published' | 'archived'
          published_at: string | null
          views_count: number
          likes_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      blog_comments: {
        Row: {
          id: string
          post_id: string
          author_name: string
          author_email: string | null
          content: string
          is_approved: boolean
          parent_comment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blog_comments']['Insert']>
      }
      notice_board: {
        Row: {
          id: string
          title: string
          student_name: string
          subject: string
          location: string
          contact_number: string
          description: string | null
          priority: 'low' | 'normal' | 'high' | 'urgent'
          category: string
          requirements: string | null
          duration: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['notice_board']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notice_board']['Insert']>
      }
      admin_notifications: {
        Row: {
          id: string
          type: string
          severity: string
          read: boolean
          read_at: string | null
          title: string | null
          message: string | null
          details: any | null
          created_at: string
          updated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['admin_notifications']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['admin_notifications']['Insert']>
      }
      featured_videos: {
        Row: {
          id: string
          title: string
          youtube_url: string
          thumbnail_url: string | null
          category: string
          duration: string
          author: string
          views_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['featured_videos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['featured_videos']['Insert']>
      }
      users: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          profile_pic_url: string | null
          wallet_balance: number | null
          verification_status: string | null
          subscription_status: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      notice_interests: {
        Row: {
          id: string
          notice_id: string
          user_name: string
          user_email: string
          user_phone: string
          message: string | null
          user_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notice_interests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notice_interests']['Insert']>
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'credit' | 'debit'
          description: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wallet_transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wallet_transactions']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Module-specific types will be imported from their respective schema files
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']