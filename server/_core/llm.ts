import { ENV } from "./env";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type InvokeParams = {
  messages: Message[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: Record<string, unknown>;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

/**
 * Calls OpenAI API for chat completions.
 * Used for review sentiment analysis.
 */
export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const { messages, model = "gpt-4o-mini", temperature = 0.3, max_tokens = 500, response_format } = params;

  if (!ENV.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const payload: Record<string, unknown> = {
    model,
    messages,
    temperature,
    max_tokens,
  };

  if (response_format) {
    payload.response_format = response_format;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ENV.openaiApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  return (await response.json()) as InvokeResult;
}
