import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Puzzle, 
  Zap, 
  Shield, 
  Users, 
  Headphones,
  TrendingUp,
  UserPlus,
  Laptop,
  Megaphone,
  Settings,
  Mail,
  Phone,
  MessageCircle,
  Check,
  Star,
  ArrowRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: ""
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('POST', '/api/contact', contactForm);
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Intelligent Conversations",
      description: "Create AI agents that understand context and provide human-like interactions for customer service and support."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Monitor your AI agents' performance with detailed analytics and insights to optimize their effectiveness."
    },
    {
      icon: Puzzle,
      title: "Easy Integration",
      description: "Seamlessly integrate with your existing tools and workflows through our comprehensive API and webhooks."
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Automate repetitive tasks and processes with intelligent AI agents that learn and adapt over time."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Enterprise-grade security and compliance features to protect your data and ensure regulatory compliance."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Enable seamless collaboration between human team members and AI agents for enhanced productivity."
    }
  ];

  const agentTemplates = [
    {
      icon: Headphones,
      title: "Customer Service Agent",
      description: "Handle customer inquiries, resolve issues, and provide 24/7 support with intelligent, empathetic responses.",
      tags: ["24/7 Available", "Multi-language"],
      template: "customer-service"
    },
    {
      icon: TrendingUp,
      title: "Sales Assistant",
      description: "Qualify leads, schedule meetings, and provide personalized product recommendations to boost sales conversion.",
      tags: ["Lead Scoring", "CRM Integration"],
      template: "sales-assistant"
    },
    {
      icon: UserPlus,
      title: "HR Assistant",
      description: "Streamline recruitment, employee onboarding, and answer HR policy questions with intelligent automation.",
      tags: ["Recruitment", "Onboarding"],
      template: "hr-assistant"
    },
    {
      icon: Laptop,
      title: "IT Support Agent",
      description: "Provide technical support, troubleshoot issues, and guide users through step-by-step solutions efficiently.",
      tags: ["Troubleshooting", "Help Desk"],
      template: "it-support"
    },
    {
      icon: Megaphone,
      title: "Marketing Assistant",
      description: "Generate content ideas, analyze campaign performance, and optimize marketing strategies with AI insights.",
      tags: ["Content Gen", "Analytics"],
      template: "marketing-assistant"
    },
    {
      icon: Settings,
      title: "Operations Manager",
      description: "Monitor operations, analyze workflows, and optimize business processes for maximum efficiency and productivity.",
      tags: ["Process Mining", "Optimization"],
      template: "operations-manager"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 3 AI agents",
        "1,000 conversations/month",
        "Basic analytics",
        "Email support",
        "Pre-built templates"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 10 AI agents",
        "10,000 conversations/month",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Team collaboration"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited AI agents",
        "Unlimited conversations",
        "Custom analytics",
        "Dedicated support",
        "On-premise deployment",
        "SLA guarantees"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Coworker-AI</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
                <a href="#agents" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">AI Agents</a>
                <a href="#pricing" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
                <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-blue-600">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Empowering Human-Collaborative
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> AI Bots</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create intelligent AI agents that work alongside your team to streamline processes, boost productivity, and transform your business operations across technology and service industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-8 py-3 text-lg">
                Watch Demo
              </Button>
            </div>
            
            {/* Dashboard Preview */}
            <div className="relative max-w-5xl mx-auto">
              <Card className="shadow-2xl border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded-md px-3 py-1 text-sm text-slate-500">app.coworker-ai.com/dashboard</div>
                    </div>
                  </div>
                </div>
                <div className="h-96 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">AI Dashboard Preview</h3>
                    <p className="text-slate-600">Manage all your AI agents from one powerful dashboard</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Powerful AI Agent Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Build, deploy, and manage intelligent AI agents tailored for your specific business needs</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-50 to-white border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agent Templates */}
      <section id="agents" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Pre-Built AI Agent Templates</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Jump-start your AI transformation with ready-to-use agent templates for common business functions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agentTemplates.map((template, index) => (
              <Card key={index} className="bg-white shadow-lg border-slate-200 overflow-hidden hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <template.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{template.title}</h3>
                  </div>
                  <p className="text-slate-600 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href="/signup">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Use Template
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Choose the perfect plan for your team size and needs. Scale up as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative p-8 ${plan.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border-slate-200 shadow-lg'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                  </div>
                )}
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-600 mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {plan.price}
                      <span className="text-lg font-normal text-slate-600">{plan.period}</span>
                    </div>
                    {plan.period && <p className="text-slate-500">per agent</p>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup">
                    <Button className={`w-full py-3 font-semibold ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Get Started Today</h2>
              <p className="text-xl text-slate-600 mb-8">Ready to transform your business with AI-powered coworkers? Contact our team to learn more or start your free trial.</p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email Support</h3>
                    <p className="text-slate-600">support@coworker-ai.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Phone Support</h3>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Live Chat</h3>
                    <p className="text-slate-600">Available 24/7 for instant support</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      <Input
                        value={contactForm.firstName}
                        onChange={(e) => setContactForm(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <Input
                        value={contactForm.lastName}
                        onChange={(e) => setContactForm(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                    <Input
                      value={contactForm.company}
                      onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <Textarea
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Coworker-AI</span>
              </div>
              <p className="text-slate-400 mb-4">Empowering businesses with intelligent AI agents that work alongside human teams to boost productivity and streamline operations.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#agents" className="hover:text-white transition-colors">AI Agents</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">&copy; 2024 Coworker-AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
