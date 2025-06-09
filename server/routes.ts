import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertAiAgentSchema, insertContactSchema, loginSchema, chatMessageSchema, type ChatMessageData } from "@shared/schema";
import { generateAgentResponse, getSystemPromptForTemplate } from "./openai";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management (simplified for demo)
  const sessions = new Map<string, { userId: number }>();

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    const session = sessionId ? sessions.get(sessionId) : null;
    
    if (!session) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    req.userId = session.userId;
    next();
  };

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      const sessionId = nanoid();
      sessions.set(sessionId, { userId: user.id });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token: sessionId 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const sessionId = nanoid();
      sessions.set(sessionId, { userId: user.id });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token: sessionId 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Agents routes
  app.get("/api/agents", requireAuth, async (req: any, res) => {
    try {
      const agents = await storage.getAgentsByUserId(req.userId);
      res.json(agents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/agents", requireAuth, async (req: any, res) => {
    try {
      const agentData = insertAiAgentSchema.parse({
        ...req.body,
        userId: req.userId,
        systemPrompt: req.body.systemPrompt || getSystemPromptForTemplate(req.body.template)
      });
      
      const agent = await storage.createAgent(agentData);
      res.json(agent);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/agents/:id", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgent(parseInt(req.params.id));
      if (!agent || agent.userId !== req.userId) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/agents/:id", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgent(parseInt(req.params.id));
      if (!agent || agent.userId !== req.userId) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      const updatedAgent = await storage.updateAgent(parseInt(req.params.id), req.body);
      res.json(updatedAgent);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/agents/:id", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgent(parseInt(req.params.id));
      if (!agent || agent.userId !== req.userId) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      await storage.deleteAgent(parseInt(req.params.id));
      res.json({ message: "Agent deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Chat routes
  app.post("/api/chat/:agentId", async (req, res) => {
    try {
      const agentId = parseInt(req.params.agentId);
      const { message, sessionId } = chatMessageSchema.parse(req.body);
      
      const agent = await storage.getAgent(agentId);
      if (!agent || !agent.isActive) {
        return res.status(404).json({ message: "Agent not found or inactive" });
      }
      
      // Get or create conversation
      let conversation = await storage.getConversation(sessionId);
      if (!conversation) {
        conversation = await storage.createConversation({
          agentId,
          sessionId,
          messages: [],
          isActive: true,
          userId: null
        });
      }
      
      // Get conversation history
      const messages = (conversation.messages as ChatMessageData[]) || [];
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Generate AI response
      const aiResponse = await generateAgentResponse(
        agent.systemPrompt,
        message,
        conversationHistory
      );
      
      // Update conversation with new messages
      const updatedMessages: ChatMessageData[] = [
        ...messages,
        { role: 'user', content: message, timestamp: Date.now() },
        { role: 'assistant', content: aiResponse.content, timestamp: Date.now() }
      ];
      
      await storage.updateConversationMessages(sessionId, updatedMessages);
      
      res.json({
        response: aiResponse.content,
        responseTime: aiResponse.responseTime
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/conversations/:sessionId", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.sessionId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics routes
  app.get("/api/analytics/agent/:agentId", requireAuth, async (req: any, res) => {
    try {
      const agentId = parseInt(req.params.agentId);
      const agent = await storage.getAgent(agentId);
      
      if (!agent || agent.userId !== req.userId) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      const analytics = await storage.getAnalyticsByAgentId(agentId);
      const conversations = await storage.getConversationsByAgentId(agentId);
      
      // Calculate current stats
      const totalConversations = conversations.length;
      const totalMessages = conversations.reduce((sum, conv) => {
        const messages = (conv.messages as ChatMessageData[]) || [];
        return sum + messages.length;
      }, 0);
      
      res.json({
        analytics,
        stats: {
          totalConversations,
          totalMessages,
          activeToday: conversations.filter(conv => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return conv.updatedAt >= today;
          }).length
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ message: "Contact form submitted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req: any, res) => {
    try {
      const agents = await storage.getAgentsByUserId(req.userId);
      const activeAgents = agents.filter(agent => agent.isActive).length;
      
      let totalConversations = 0;
      let averageSatisfaction = 0;
      
      for (const agent of agents) {
        const conversations = await storage.getConversationsByAgentId(agent.id);
        totalConversations += conversations.length;
      }
      
      // Mock satisfaction score for demo
      averageSatisfaction = 96;
      
      res.json({
        activeAgents,
        totalConversations,
        averageSatisfaction
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
