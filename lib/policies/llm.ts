import OpenAI from "openai";

export async function enhancePolicyWithLlm(policyMarkdown: string) {
  if (!process.env.OPENAI_API_KEY) {
    return policyMarkdown;
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
  });

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Improve an internal security policy. Do not make legal claims, do not claim certifications, do not invent regulatory status, and keep wording practical for a small organisation."
      },
      { role: "user", content: policyMarkdown }
    ],
    temperature: 0.2
  });

  return response.choices[0]?.message.content ?? policyMarkdown;
}
