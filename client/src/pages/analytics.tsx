import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Bot, MessageSquare, TrendingUp, Clock } from "lucide-react";

export default function Analytics() {
  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/agents'],
    queryFn: () => api.get('/api/agents'),
  });

  // Mock analytics data for demo purposes
  const conversationData = [
    { date: '2024-01-01', conversations: 45 },
    { date: '2024-01-02', conversations: 52 },
    { date: '2024-01-03', conversations: 38 },
    { date: '2024-01-04', conversations: 65 },
    { date: '2024-01-05', conversations: 72 },
    { date: '2024-01-06', conversations: 58 },
    { date: '2024-01-07', conversations: 81 },
  ];

  const agentPerformanceData = [
    { name: 'Customer Support', conversations: 245, satisfaction: 96 },
    { name: 'Sales Assistant', conversations: 189, satisfaction: 94 },
    { name: 'HR Assistant', conversations: 156, satisfaction: 98 },
    { name: 'IT Support', conversations: 134, satisfaction: 92 },
  ];

  const responseTimeData = [
    { hour: '00:00', avgTime: 1.2 },
    { hour: '04:00', avgTime: 0.8 },
    { hour: '08:00', avgTime: 1.5 },
    { hour: '12:00', avgTime: 2.1 },
    { hour: '16:00', avgTime: 1.8 },
    { hour: '20:00', avgTime: 1.3 },
  ];

  const satisfactionData = [
    { name: 'Excellent (5 stars)', value: 65, color: '#10b981' },
    { name: 'Good (4 stars)', value: 25, color: '#3b82f6' },
    { name: 'Average (3 stars)', value: 8, color: '#f59e0b' },
    { name: 'Poor (1-2 stars)', value: 2, color: '#ef4444' },
  ];

  if (agentsLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalConversations = agentPerformanceData.reduce((sum, agent) => sum + agent.conversations, 0);
  const avgSatisfaction = Math.round(agentPerformanceData.reduce((sum, agent) => sum + agent.satisfaction, 0) / agentPerformanceData.length);
  const avgResponseTime = 1.4; // seconds

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 md:ml-64 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-2">Monitor your AI agents' performance and insights</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Agents</p>
                    <p className="text-3xl font-bold text-slate-900">{agents?.length || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Conversations</p>
                    <p className="text-3xl font-bold text-slate-900">{totalConversations}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Satisfaction</p>
                    <p className="text-3xl font-bold text-slate-900">{avgSatisfaction}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                    <p className="text-3xl font-bold text-slate-900">{avgResponseTime}s</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Conversations Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Conversations Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={conversationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="conversations" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Response Time by Hour */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgTime" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agent Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversations" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Satisfaction Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
