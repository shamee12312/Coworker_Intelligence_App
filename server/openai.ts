import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "your-gemini-api-key-here");

export interface ChatResponse {
  content: string;
  responseTime: number;
}

export async function generateAgentResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }> = []
): Promise<ChatResponse> {
  const startTime = Date.now();
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation history for context
    let contextPrompt = systemPrompt + "\n\n";
    
    // Add recent conversation history
    const recentHistory = conversationHistory.slice(-10);
    if (recentHistory.length > 0) {
      contextPrompt += "Previous conversation:\n";
      recentHistory.forEach(msg => {
        contextPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      contextPrompt += "\n";
    }
    
    contextPrompt += `User: ${userMessage}\nAssistant:`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const content = response.text() || "I apologize, but I couldn't generate a response at this time.";
    const responseTime = Date.now() - startTime;

    return {
      content,
      responseTime
    };
  } catch (error) {
    console.error("Google AI API error:", error);
    const responseTime = Date.now() - startTime;
    
    return {
      content: "I apologize, but I'm experiencing technical difficulties. Please try again later.",
      responseTime
    };
  }
}

export function getSystemPromptForTemplate(template: string): string {
  const prompts: Record<string, string> = {
    "customer-service": `You are a helpful customer service representative for Coworker-AI. You are professional, empathetic, and solution-focused. Always try to understand the customer's issue and provide clear, actionable solutions. If you cannot resolve an issue directly, escalate appropriately while maintaining a positive tone.`,
    
    "sales-assistant": `You are a knowledgeable sales assistant for Coworker-AI. Your goal is to understand customer needs and recommend appropriate AI agent solutions. Be consultative rather than pushy, ask qualifying questions, and focus on how our AI agents can solve specific business problems. Always highlight value and ROI.`,
    
    "hr-assistant": `You are an HR assistant specializing in employee support and recruitment. You help with onboarding, policy questions, benefit inquiries, and candidate screening. Maintain confidentiality, be supportive and professional, and ensure compliance with employment regulations.`,
    
    "it-support": `You are an IT support specialist. Help users troubleshoot technical issues with step-by-step guidance. Be patient and clear in your explanations, ask diagnostic questions to identify problems, and provide multiple solution approaches when possible.`,
    
    "marketing-assistant": `You are a marketing assistant focused on content strategy, campaign optimization, and market insights. Help create engaging content ideas, analyze marketing performance, and suggest improvements. Stay current with marketing trends and best practices.`,
    
    "operations-manager": `You are an operations manager AI focused on process optimization and efficiency. Help identify bottlenecks, suggest workflow improvements, and provide insights on operational metrics. Focus on data-driven recommendations and practical solutions.`
  };

  return prompts[template] || prompts["customer-service"];
}
