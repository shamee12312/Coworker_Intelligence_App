import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { Bot, MessageSquare, TrendingUp, Users, Plus, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => api.get('/api/dashboard/stats'),
  });

  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/agents'],
    queryFn: () => api.get('/api/agents'),
  });

  if (statsLoading || agentsLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 md:ml-64 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.firstName}!</h1>
            <p className="text-slate-600 mt-2">Here's what's happening with your AI agents today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Agents</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.activeAgents || 0}</p>
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
                    <p className="text-3xl font-bold text-slate-900">{stats?.totalConversations || 0}</p>
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
                    <p className="text-sm font-medium text-slate-600">Satisfaction Score</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.averageSatisfaction || 0}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Agents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your AI Agents</CardTitle>
                  <Link href="/agents">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Agent
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {agents && agents.length > 0 ? (
                  <div className="space-y-4">
                    {agents.slice(0, 3).map((agent: any) => (
                      <div key={agent.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Bot className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">{agent.name}</h3>
                            <p className="text-sm text-slate-600">{agent.template.replace('-', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${agent.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {agent.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <Link href={`/chat/${agent.id}`}>
                            <Button size="sm" variant="outline">
                              Test
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {agents.length === 0 && (
                      <div className="text-center py-8">
                        <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">No agents created yet</p>
                        <Link href="/agents">
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                            Create Your First Agent
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No agents created yet</p>
                    <Link href="/agents">
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Create Your First Agent
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/agents">
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-5 w-5 mr-3" />
                      Create New AI Agent
                    </Button>
                  </Link>
                  
                  <Link href="/analytics">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-5 w-5 mr-3" />
                      View Analytics
                    </Button>
                  </Link>
                  
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-5 w-5 mr-3" />
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
