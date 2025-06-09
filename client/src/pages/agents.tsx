import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/sidebar";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { AgentCard } from "@/components/agent-card";
import { Plus, Headphones, TrendingUp, UserPlus, Laptop, Megaphone, Settings } from "lucide-react";

const agentTemplates = [
  {
    id: "customer-service",
    name: "Customer Service Agent",
    description: "Handle customer inquiries and provide 24/7 support",
    icon: Headphones,
    systemPrompt: "You are a helpful customer service representative. You are professional, empathetic, and solution-focused."
  },
  {
    id: "sales-assistant",
    name: "Sales Assistant",
    description: "Qualify leads and provide product recommendations",
    icon: TrendingUp,
    systemPrompt: "You are a knowledgeable sales assistant. Help customers understand products and recommend appropriate solutions."
  },
  {
    id: "hr-assistant",
    name: "HR Assistant",
    description: "Support employee onboarding and HR queries",
    icon: UserPlus,
    systemPrompt: "You are an HR assistant. Help with onboarding, policy questions, and employee support while maintaining confidentiality."
  },
  {
    id: "it-support",
    name: "IT Support Agent",
    description: "Provide technical support and troubleshooting",
    icon: Laptop,
    systemPrompt: "You are an IT support specialist. Help users troubleshoot technical issues with clear, step-by-step guidance."
  },
  {
    id: "marketing-assistant",
    name: "Marketing Assistant",
    description: "Create content and analyze marketing performance",
    icon: Megaphone,
    systemPrompt: "You are a marketing assistant. Help create engaging content and provide marketing insights and recommendations."
  },
  {
    id: "operations-manager",
    name: "Operations Manager",
    description: "Optimize processes and improve efficiency",
    icon: Settings,
    systemPrompt: "You are an operations manager. Help identify bottlenecks and suggest process improvements for better efficiency."
  }
];

export default function Agents() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template: "",
    systemPrompt: ""
  });

  const { data: agents, isLoading } = useQuery({
    queryKey: ['/api/agents'],
    queryFn: () => api.get('/api/agents'),
  });

  const createAgentMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/agents', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "", template: "", systemPrompt: "" });
      toast({
        title: "Agent created!",
        description: "Your AI agent has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create agent.",
        variant: "destructive",
      });
    },
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = agentTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        template: templateId,
        systemPrompt: template.systemPrompt,
        name: prev.name || template.name,
        description: prev.description || template.description
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createAgentMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI Agents</h1>
              <p className="text-slate-600 mt-2">Create and manage your AI-powered coworkers</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New AI Agent</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="template">Choose a Template</Label>
                    <Select value={formData.template} onValueChange={handleTemplateSelect}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select an agent template" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="mt-1"
                      placeholder="Enter agent name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                      placeholder="Brief description of the agent's purpose"
                    />
                  </div>

                  <div>
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Textarea
                      id="systemPrompt"
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                      required
                      className="mt-1"
                      rows={4}
                      placeholder="Define how the agent should behave and respond"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={createAgentMutation.isPending}
                    >
                      {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Templates Section */}
          {(!agents || agents.length === 0) && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Start Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    handleTemplateSelect(template.id);
                    setIsCreateDialogOpen(true);
                  }}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <template.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">{template.name}</h3>
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{template.description}</p>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Agents Grid */}
          {agents && agents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Agents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent: any) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          )}

          {agents && agents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No agents yet</h3>
              <p className="text-slate-600 mb-6">Create your first AI agent to get started</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Agent
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
