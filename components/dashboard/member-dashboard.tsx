"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList,
  Bell,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  User,
  Calendar
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useTranslation } from "@/lib/i18n/context";

interface RecentTask {
  id: string;
  title: string;
  status: string;
  due_date?: string;
  assigned_user?: { full_name: string } | null;
  loft?: { name: string } | null;
  priority?: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  created_at: string;
  read: boolean;
}

interface Conversation {
  id: string;
  title: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  participants: string[];
}

interface MemberStats {
  myTasks: number;
  completedTasks: number;
  unreadNotifications: number;
  activeConversations: number;
}

export function MemberDashboard() {
  const { t } = useTranslation();
  
  const [stats, setStats] = useState<MemberStats>({
    myTasks: 0,
    completedTasks: 0,
    unreadNotifications: 0,
    activeConversations: 0
  });
  
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      setLoading(true);

      // Mock data for member dashboard - replace with real API calls
      setStats({
        myTasks: 8,
        completedTasks: 15,
        unreadNotifications: 3,
        activeConversations: 2
      });

      // Mock recent tasks assigned to member - using translation keys
      setRecentTasks([
        {
          id: "1",
          title: t("dashboard:mockData.tasks.monthlyCleaningHydra"),
          status: "in_progress",
          due_date: "2024-08-22",
          assigned_user: { full_name: t("dashboard:mockData.me") },
          loft: { name: t("dashboard:mockData.lofts.artisticHydra") },
          priority: "high"
        },
        {
          id: "2", 
          title: t("dashboard:mockData.tasks.equipmentCheck"),
          status: "todo",
          due_date: "2024-08-25",
          assigned_user: { full_name: t("dashboard:mockData.me") },
          loft: { name: t("dashboard:mockData.lofts.modernDowntown") },
          priority: "medium"
        },
        {
          id: "3",
          title: t("dashboard:mockData.tasks.monthlyReport"),
          status: "completed",
          due_date: "2024-08-15",
          assigned_user: { full_name: t("dashboard:mockData.me") },
          loft: { name: t("dashboard:mockData.lofts.industrialKouba") },
          priority: "low"
        },
        {
          id: "4",
          title: t("dashboard:mockData.tasks.preventiveMaintenance"),
          status: "todo",
          due_date: "2024-08-28",
          assigned_user: { full_name: t("dashboard:mockData.me") },
          loft: { name: t("dashboard:mockData.lofts.artisticHydra") },
          priority: "medium"
        }
      ]);

      // Mock notifications
      setNotifications([
        {
          id: "1",
          title: t("dashboard:mockData.notifications.newTaskAssigned.title"),
          message: t("dashboard:mockData.notifications.newTaskAssigned.message"),
          type: "info",
          created_at: "2024-08-20T10:30:00Z",
          read: false
        },
        {
          id: "2",
          title: t("dashboard:mockData.notifications.taskDueSoon.title"),
          message: t("dashboard:mockData.notifications.taskDueSoon.message"),
          type: "warning",
          created_at: "2024-08-20T09:15:00Z",
          read: false
        },
        {
          id: "3",
          title: t("dashboard:mockData.notifications.taskCompleted.title"),
          message: t("dashboard:mockData.notifications.taskCompleted.message"),
          type: "success",
          created_at: "2024-08-19T16:45:00Z",
          read: true
        }
      ]);

      // Mock conversations
      setConversations([
        {
          id: "1",
          title: t("dashboard:mockData.conversations.maintenanceTeam.title"),
          last_message: t("dashboard:mockData.conversations.maintenanceTeam.lastMessage"),
          last_message_at: "2024-08-20T14:30:00Z",
          unread_count: 2,
          participants: ["Ahmed", "Fatima", t("dashboard:mockData.me")]
        },
        {
          id: "2",
          title: t("dashboard:mockData.conversations.techSupport.title"),
          last_message: t("dashboard:mockData.conversations.techSupport.lastMessage"),
          last_message_at: "2024-08-20T11:20:00Z",
          unread_count: 0,
          participants: [t("dashboard:mockData.conversations.techSupport.title"), t("dashboard:mockData.me")]
        }
      ]);

      setLastUpdated(new Date());

    } catch (error) {
      console.error("Error fetching member data:", error);
      toast.error(t("dashboard:loadingError"));
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800 border-green-200";
      case 'in_progress':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'todo':
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t("dashboard:tasks.status.completed");
      case 'in_progress':
        return t("dashboard:tasks.status.inProgress");
      case 'todo':
        return t("dashboard:tasks.status.todo");
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return "text-red-600";
      case 'medium':
        return "text-orange-600";
      case 'low':
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t("dashboard:memberTitle")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("dashboard:memberSubtitle")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">{t("dashboard:myTasks")}</p>
                <p className="text-3xl font-bold">{stats.myTasks}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {recentTasks.filter(t => t.status === 'in_progress').length} {t("dashboard:inProgress")}
                </p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">{t("dashboard:completedTasks")}</p>
                <p className="text-3xl font-bold">{stats.completedTasks}</p>
                <p className="text-green-100 text-xs mt-1">
                  {t("dashboard:thisMonth")}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">{t("dashboard:notifications")}</p>
                <p className="text-3xl font-bold">{stats.unreadNotifications}</p>
                <p className="text-orange-100 text-xs mt-1">
                  {t("dashboard:unread")}
                </p>
              </div>
              <Bell className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">{t("dashboard:conversations")}</p>
                <p className="text-3xl font-bold">{stats.activeConversations}</p>
                <p className="text-purple-100 text-xs mt-1">
                  {conversations.reduce((sum, c) => sum + c.unread_count, 0)} {t("dashboard:newMessages")}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* My Tasks - Takes 2 columns */}
        <Card className="lg:col-span-2 border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <ClipboardList className="h-6 w-6 text-blue-600" />
              {t("dashboard:myTasks")}
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  {t("dashboard:updated")} {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchMemberData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-md transition-all">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      {task.priority && (
                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          ●
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.loft?.name}
                    </p>
                    {task.due_date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {t("dashboard:bills.due")}: {format(new Date(task.due_date), "d MMM yyyy")}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getTaskStatusColor(task.status)}>
                      {getTaskStatusText(task.status)}
                    </Badge>
                    {task.status !== 'completed' && (
                      <Button size="sm" variant="outline" className="text-xs">
                        {t("dashboard:viewDetails")}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Bell className="h-6 w-6 text-orange-600" />
              {t("dashboard:notifications")}
            </CardTitle>
            <CardDescription>{t("dashboard:latestUpdates")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.created_at), "d MMM, HH:mm")}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <MessageCircle className="h-6 w-6 text-purple-600" />
            {t("dashboard:recentConversations")}
          </CardTitle>
          <CardDescription>{t("dashboard:teamMessages")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-purple-50 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{conversation.title}</h4>
                  {conversation.unread_count > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {conversation.last_message}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{conversation.participants.join(", ")}</span>
                  <span>{format(new Date(conversation.last_message_at), "d MMM, HH:mm")}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}