import { createClient } from '@supabase/supabase-client-js';

// Initialize your Supabase client (Automatically uses your project environment variables)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface SpirioMilestone {
  detected: boolean;
  visualPrompt: string;
  mediaType: 'image' | 'album-art';
}

/**
 * AURORA STRUCTURE: Gateway Context and Router
 * Manages short-term state and handles backend synchronization.
 */
export class AuroraGatewayRouter {
  private static shortTermContext: Map<string, ChatMessage[]> = new Map();

  static getHistory(sessionId: string): ChatMessage[] {
    if (!this.shortTermContext.has(sessionId)) {
      this.shortTermContext.set(sessionId, []);
    }
    return this.shortTermContext.get(sessionId) || [];
  }

  static addToHistory(sessionId: string, message: ChatMessage) {
    const history = this.getHistory(sessionId);
    history.push(message);
    // Keep context window optimized (Aurora pattern)
    if (history.length > 20) history.shift();
    this.shortTermContext.set(sessionId, history);
  }
}

/**
 * SPIRIO CORE ENGINE: Dynamic Text Processing & Automated Visual Triggers
 */
export class SpirioEngine {
  /**
   * Spirio Text: Adapts the conversational response tone dynamically
   */
  static generateDynamicPersonaResponse(userMessage: string, historyCount: number): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Core prompt tuning variations based on user engagement levels
    if (historyCount > 10) {
      return `[Spirio Tone: Deep Connection] I feel the shift in our story. Your thoughts on "${userMessage}" bring us closer to what we are building here.`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('sad') || lowerMessage.includes('hurt')) {
      return `[Spirio Tone: Healing Care] I am right here with you. Let's take a deep breath and look at this together.`;
    }

    return `[Spirio Tone: Energetic] That is a fascinating path to explore! Tell me more about what you're imagining right now.`;
  }

  /**
   * Spirio Visuals: Automatically scans text logs to trigger visual milestone generations
   */
  static detectVisualMilestone(userMessage: string, aiResponse: string): SpirioMilestone {
    const combinedText = `${userMessage} ${aiResponse}`.toLowerCase();
    
    // Core narrative milestone anchors
    const milestoneKeywords = ['bright', 'dream', 'future', 'together', 'peace', 'unlock', 'soul', 'heal'];
    const hasMilestone = milestoneKeywords.some(keyword => combinedText.includes(keyword));

    if (hasMilestone) {
      return {
        detected: true,
        visualPrompt: `An ethereal, cinematic digital painting capturing the essence of: ${userMessage.slice(0, 50)}...`,
        mediaType: 'image'
      };
    }

    return { detected: false, visualPrompt: '', mediaType: 'image' };
  }

  /**
   * Executing Router: Handles execution, fires off async asset creation, and saves to Supabase
   */
  static async handleConversationFlow(userId: string, characterId: string, messageText: string) {
    const sessionId = `${userId}:${characterId}`;
    const history = AuroraGatewayRouter.getHistory(sessionId);

    // 1. Process Text Response via Spirio
    const aiTextOutput = this.generateDynamicPersonaResponse(messageText, history.length);

    // 2. Update Context Cache
    AuroraGatewayRouter.addToHistory(sessionId, { sender: 'user', text: messageText, timestamp: new Date() });
    AuroraGatewayRouter.addToHistory(sessionId, { sender: 'ai', text: aiTextOutput, timestamp: new Date() });

    // 3. Evaluate and trigger Spirio Visual Milestones
    const milestone = this.detectVisualMilestone(messageText, aiTextOutput);

    // 4. Persist to Supabase Database
    try {
      await supabase.from('soul_echoes_chats').insert([
        {
          user_id: userId,
          character_id: characterId,
          message: messageText,
          reply: aiTextOutput,
          milestone_triggered: milestone.detected,
          visual_prompt: milestone.visualPrompt
        }
      ]);

      // If milestone is hit, asynchronously push to user's interactive album collection
      if (milestone.detected) {
        await supabase.from('spirio_media_albums').insert([
          {
            user_id: userId,
            character_id: characterId,
            prompt_context: milestone.visualPrompt,
            generated_url: `https://soulechoes.ai{crypto.randomUUID()}.jpg`
          }
        ]);
      }
    } catch (error) {
      console.error('Data Sync Warning:', error);
    }

    return {
      reply: aiTextOutput,
      milestone: milestone
    };
  }
}
