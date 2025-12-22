/**
 * OpenAI Client Configuration
 * Handles all OpenAI API interactions
 */

import OpenAI from "openai";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Model configuration
export const AI_CONFIG = {
  model: "gpt-4o", // GPT-4 Optimized
  temperature: 0.7, // Balance between creativity and consistency
  maxTokens: 2000,
  streamingModel: "gpt-4o", // For streaming responses
};

/**
 * Generate chat completion
 */
export async function generateChatCompletion(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options?: {
    temperature?: number;
    maxTokens?: number;
    functions?: any[];
  }
) {
  const response = await openai.chat.completions.create({
    model: AI_CONFIG.model,
    messages,
    temperature: options?.temperature ?? AI_CONFIG.temperature,
    max_tokens: options?.maxTokens ?? AI_CONFIG.maxTokens,
    functions: options?.functions,
  });

  return response;
}

/**
 * Generate streaming chat completion
 */
export async function generateStreamingCompletion(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
) {
  const stream = await openai.chat.completions.create({
    model: AI_CONFIG.streamingModel,
    messages,
    temperature: options?.temperature ?? AI_CONFIG.temperature,
    max_tokens: options?.maxTokens ?? AI_CONFIG.maxTokens,
    stream: true,
  });

  return stream;
}

/**
 * Extract structured data using function calling
 */
export async function extractStructuredData<T>(
  prompt: string,
  schema: {
    name: string;
    description: string;
    parameters: any;
  }
): Promise<T | null> {
  const response = await openai.chat.completions.create({
    model: AI_CONFIG.model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    functions: [schema],
    function_call: { name: schema.name },
  });

  const functionCall = response.choices[0]?.message?.function_call;
  if (functionCall && functionCall.arguments) {
    try {
      return JSON.parse(functionCall.arguments) as T;
    } catch (error) {
      console.error("Failed to parse function call arguments:", error);
      return null;
    }
  }

  return null;
}

