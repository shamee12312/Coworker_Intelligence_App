import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  MessageSquare,
  Bot,
  Headphones,
  TrendingUp,
  UserPlus,
  Laptop,
  Megaphone,
  Settings as SettingsIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

interface Agent {
  id: number;
  name: string;
  description?: string;
  template: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AgentCardProps {
  agent: Agent;
}

const templateIcons: Record<string, any> = {
  "customer-service": Headphones,
  "sales-assistant": TrendingUp,
  "hr-assistant": UserPlus,
  "it-support": Laptop,
  "marketing-assistant": Megaphone,
  "operations-manager": SettingsIcon,
};

const templateColors: Record<string, string> = {
  "customer-service": "bg-blue-100 text-blue-700",
  "sales-assistant": "bg-green-100 text-green-700",
  "hr-assistant": "bg-purple-100 text-purple-700",
  "it-support": "bg-orange-100 text-orange-700",
  "marketing-assistant": "bg-pink-100 text-pink-700",
  "operations-manager": "bg-gray-100 text-gray-700",
};

export function AgentCard({ agent }: AgentCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const TemplateIcon = templateIcons[agent.template] || Bot;
  const templateColor = templateColors[agent.template] || "bg-gray-100 text-gray-700";

  const toggleAgentMutation = useMutation({
    mutationFn: () => 
      api.put(`/api/agents/${agent.id}`, { isActive: !agent.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
      toast({
        title: `Agent ${agent.isActive ? 'deactivated' : 'activated'}`,
        description: `${agent.name} has been ${agent.isActive ? 'deactivated' : 'activated'} successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update agent status.",
        variant: "destructive",
      });
    },
  });

  const deleteAgentMutation = useMutation({
    mutationFn: () => api.delete(`/api/agents/${agent.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
      toast({
        title: "Agent deleted",
        description: `${agent.name} has been deleted successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete agent.",
        variant: "destructive",
      });
    },
  });

  const handleToggleActive = () => {
    setIsLoading(true);
    toggleAgentMutation.mutate();
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${agent.name}? This action cannot be undone.`)) {
      deleteAgentMutation.mutate();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTemplate = (template: string) => {
    return template.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${templateColor}`}>
              <TemplateIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{agent.name}</h3>
              <p className="text-sm text-slate-500">{formatTemplate(agent.template)}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleActive} disabled={isLoading}>
                {agent.isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {agent.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{agent.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <Badge 
            variant={agent.isActive ? "default" : "secondary"}
            className={agent.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
          >
            {agent.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <span className="text-xs text-slate-500">
            Created {formatDate(agent.createdAt)}
          </span>
        </div>

        <div className="flex space-x-2">
          <Link href={`/chat/${agent.id}`} className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled={!agent.isActive}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Test Chat
            </Button>
          </Link>
          <Link href={`/analytics`} className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              View Analytics
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
