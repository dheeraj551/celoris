"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  Bot, 
  Brain, 
  Mail, 
  Database, 
  Clock, 
  Activity, 
  Settings, 
  Play,
  Pause,
  BarChart3,
  FileText,
  BookOpen,
  Send,
  Trash2,
  RefreshCw,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase-client"

interface AutomationTask {
  id: string
  task_name: string
  task_type: string
  status: string
  next_run_at: string
  last_run_at: string
  is_active: boolean
  execution_count: number
  success_count: number
  failure_count: number
  description: string
}

interface AutomationLog {
  id: string
  task_id: string
  status: string
  start_time: string
  end_time: string
  execution_time_ms: number
  output_data: any
  error_message: string | null
}

export default function AutomationDashboard() {
  const [tasks, setTasks] = useState<AutomationTask[]>([])
  const [logs, setLogs] = useState<AutomationLog[]>([])
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadAutomationData()
  }, [])

  const loadAutomationData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Load automation tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('automation_tasks')
        .select('*')
        .order('priority', { ascending: true })

      if (tasksError) {
        console.error('Error loading tasks:', tasksError)
      } else {
        setTasks(tasksData || [])
      }

      // Load recent logs
      const { data: logsData, error: logsError } = await supabase
        .from('automation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (logsError) {
        console.error('Error loading logs:', logsError)
      } else {
        setLogs(logsData || [])
      }

      // Load content performance
      const { data: contentData, error: contentError } = await supabase
        .from('automated_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (contentError) {
        console.error('Error loading content:', contentError)
      } else {
        setContent(contentData || [])
      }

    } catch (error) {
      console.error('Error loading automation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (taskId: string, isActive: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await (supabase as any)
        .from('automation_tasks')
        .update({ is_active: !isActive })
        .eq('id', taskId)

      if (!error) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, is_active: !isActive } : task
        ))
      }
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const runTaskManually = async (taskId: string) => {
    try {
      const supabase = createClient()
      
      // Update task status
      await (supabase as any)
        .from('automation_tasks')
        .update({ status: 'running' })
        .eq('id', taskId)

      // Trigger the Edge Function
      // Note: In a real implementation, you'd call the appropriate Edge Function
      
      // For demo purposes, just simulate the execution
      setTimeout(() => {
        loadAutomationData()
      }, 2000)
      
    } catch (error) {
      console.error('Error running task:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType) {
      case 'blog_generation':
        return <FileText className="h-5 w-5 text-blue-500" />
      case 'course_lesson_generation':
        return <BookOpen className="h-5 w-5 text-green-500" />
      case 'newsletter_send':
        return <Send className="h-5 w-5 text-purple-500" />
      case 'database_cleanup':
        return <Database className="h-5 w-5 text-orange-500" />
      case 'content_publishing':
        return <Activity className="h-5 w-5 text-indigo-500" />
      default:
        return <Bot className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const getNextRunTime = (nextRunAt: string) => {
    if (!nextRunAt) return 'Not scheduled'
    const date = new Date(nextRunAt)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    
    if (diffMs <= 0) return 'Due now'
    
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`
    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`
    return `${diffMins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span>Loading automation dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Automation Dashboard</h1>
            <p className="text-text-secondary mt-2">
              Manage and monitor your automated workflows
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={loadAutomationData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.filter(t => t.is_active).length}</div>
                  <p className="text-xs text-muted-foreground">
                    {tasks.length} total tasks
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tasks.length > 0 ? Math.round(
                      (tasks.reduce((acc, t) => acc + t.success_count, 0) / 
                       Math.max(1, tasks.reduce((acc, t) => acc + t.execution_count, 0))) * 100
                    ) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{content.length}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Task</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tasks
                      .filter(t => t.is_active)
                      .sort((a, b) => new Date(a.next_run_at).getTime() - new Date(b.next_run_at).getTime())[0]?.task_name.substring(0, 8) + '...'
                      || 'None'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tasks.filter(t => t.is_active).length} scheduled
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>Latest automation task executions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(log.status)}
                          <div>
                            <p className="text-sm font-medium">
                              {tasks.find(t => t.id === log.task_id)?.task_name || 'Unknown Task'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.start_time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={log.status === 'completed' ? 'default' : log.status === 'failed' ? 'destructive' : 'secondary'}>
                            {log.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDuration(log.execution_time_ms || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>Tasks scheduled to run soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks
                      .filter(t => t.is_active && t.next_run_at)
                      .sort((a, b) => new Date(a.next_run_at).getTime() - new Date(b.next_run_at).getTime())
                      .slice(0, 5)
                      .map((task) => (
                        <div key={task.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getTaskTypeIcon(task.task_type)}
                            <div>
                              <p className="text-sm font-medium">{task.task_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {task.task_type.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">
                              {getNextRunTime(task.next_run_at)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTaskTypeIcon(task.task_type)}
                        <div>
                          <CardTitle className="text-lg">{task.task_name}</CardTitle>
                          <CardDescription>{task.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <Switch
                          checked={task.is_active}
                          onCheckedChange={() => toggleTask(task.id, task.is_active)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <Badge 
                          variant={task.status === 'completed' ? 'default' : 
                                  task.status === 'failed' ? 'destructive' : 
                                  task.status === 'running' ? 'secondary' : 'outline'}
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Next Run</p>
                        <p className="text-sm text-muted-foreground">
                          {getNextRunTime(task.next_run_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Success Rate</p>
                        <p className="text-sm text-muted-foreground">
                          {task.execution_count > 0 ? 
                            Math.round((task.success_count / task.execution_count) * 100) : 0}%
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => runTaskManually(task.id)}
                          disabled={task.status === 'running'}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>AI-generated content from automation tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">{item.content_type}</Badge>
                            <Badge variant={item.content_status === 'published' ? 'default' : 'secondary'}>
                              {item.content_status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {item.views_count || 0} views
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Logs</CardTitle>
                <CardDescription>Detailed logs of automation task executions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(log.status)}
                          <div>
                            <p className="font-medium">
                              {tasks.find(t => t.id === log.task_id)?.task_name || 'Unknown Task'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.start_time).toLocaleString()}
                            </p>
                            {log.error_message && (
                              <p className="text-sm text-red-600 mt-1">
                                Error: {log.error_message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatDuration(log.execution_time_ms || 0)}
                          </p>
                          <Badge 
                            variant={log.status === 'completed' ? 'default' : 'destructive'}
                            className="mt-1"
                          >
                            {log.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Settings</CardTitle>
                  <CardDescription>Configure global automation settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-cleanup logs</p>
                      <p className="text-sm text-muted-foreground">Automatically clean old logs</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email notifications</p>
                      <p className="text-sm text-muted-foreground">Send email on task failures</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-retry failed tasks</p>
                      <p className="text-sm text-muted-foreground">Retry failed tasks automatically</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>Configure external API keys</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">OpenAI API Key</label>
                    <input 
                      type="password" 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      placeholder="sk-..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">SendGrid API Key</label>
                    <input 
                      type="password" 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      placeholder="SG...."
                    />
                  </div>
                  <Button className="w-full">Save Configuration</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
