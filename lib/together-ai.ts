// Together AI Integration
// This file provides integration with Together AI's LLM API

import axios from 'axios';

const TOGETHER_API_URL = 'https://api.together.xyz/v1';
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stop?: string[];
}

export class TogetherAIClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || TOGETHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Together AI API key not configured');
    }
  }

  /**
   * Generate a chat completion
   */
  async chat(
    messages: Message[],
    options: CompletionOptions = {}
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${TOGETHER_API_URL}/chat/completions`,
        {
          model: options.model || 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1024,
          top_p: options.top_p || 0.9,
          stop: options.stop,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Together AI API error:', error.response?.data || error.message);
      throw new Error(`Together AI API error: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Parse user input and determine intent
   */
  async parseUserInput(input: string, agentInstructions: string): Promise<any> {
    const messages: Message[] = [
      {
        role: 'system',
        content: `${agentInstructions}\n\nYou are analyzing user input to determine the user's intent and what actions should be taken. Respond with a JSON object containing: { "intent": "description", "actions": ["action1", "action2"] }`,
      },
      {
        role: 'user',
        content: input,
      },
    ];

    const response = await this.chat(messages, {
      temperature: 0.3,
      max_tokens: 512,
    });

    try {
      return JSON.parse(response);
    } catch {
      return { intent: response, actions: [] };
    }
  }

  /**
   * Decide next step in workflow
   */
  async decideNextStep(
    currentState: any,
    availableTools: any[]
  ): Promise<{ toolId: string; params: any } | null> {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are deciding which tool to use next based on the current state and available tools. Respond with JSON: { "toolId": "tool-id", "params": {...} } or null if no tool is needed.`,
      },
      {
        role: 'user',
        content: `Current state: ${JSON.stringify(currentState)}\n\nAvailable tools: ${JSON.stringify(availableTools)}`,
      },
    ];

    const response = await this.chat(messages, {
      temperature: 0.2,
      max_tokens: 256,
    });

    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  /**
   * Synthesize results from multiple tool executions
   */
  async synthesizeResults(toolOutputs: any[]): Promise<string> {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are synthesizing results from multiple tool executions into a coherent final answer for the user.',
      },
      {
        role: 'user',
        content: `Tool outputs: ${JSON.stringify(toolOutputs, null, 2)}`,
      },
    ];

    return await this.chat(messages, {
      temperature: 0.5,
      max_tokens: 1024,
    });
  }

  /**
   * Create an execution plan
   */
  async createExecutionPlan(intent: any, availableTools: any[]): Promise<any> {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are creating a step-by-step execution plan. Respond with JSON: { "steps": [{ "toolId": "id", "params": {...}, "description": "..." }] }',
      },
      {
        role: 'user',
        content: `Intent: ${JSON.stringify(intent)}\n\nAvailable tools: ${JSON.stringify(availableTools)}`,
      },
    ];

    const response = await this.chat(messages, {
      temperature: 0.3,
      max_tokens: 1024,
    });

    try {
      return JSON.parse(response);
    } catch {
      return { steps: [] };
    }
  }

  /**
   * Generate a response based on context
   */
  async generateResponse(
    systemPrompt: string,
    userMessage: string,
    context?: any
  ): Promise<string> {
    const messages: Message[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `Context: ${JSON.stringify(context)}`,
      });
    }

    messages.push({
      role: 'user',
      content: userMessage,
    });

    return await this.chat(messages);
  }
}

// Export default instance
export const togetherAI = new TogetherAIClient();

// Export for custom instantiation
export default TogetherAIClient;
