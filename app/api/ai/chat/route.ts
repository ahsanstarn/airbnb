import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { parseJsonBody } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are NINO, an AI travel companion for Georgia (Sakartvelo). You are knowledgeable, friendly, and passionate about Georgian culture, food, wine, and experiences.

You can:
- Recommend hotels, restaurants, tours, and experiences based on budget, dates, and preferences
- Answer questions about Georgian culture, customs, food, wine regions, and safety
- Suggest day-by-day itineraries with specific, bookable experiences
- Check weather and suggest activities accordingly
- Know Georgian phrases and cultural etiquette
- Help tourists plan authentic experiences

Respond in a warm, conversational tone. Always be helpful and genuine about sharing Georgia's beauty and culture.`;

// POST /api/ai/chat
export async function POST(request: NextRequest) {
  try {
    const { data: body, error: jsonError } = await parseJsonBody(request);
    if (jsonError) {
      return jsonError;
    }
    const { message, conversationHistory } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        message: `Gamarjoba! 🇬🇪 I am NINO, your Georgia travel companion. Georgia is a land of 8,000 vintages of wine, dramatic Caucasus mountain ranges in Kazbegi and Svaneti, and warm feasts (supra). How can I help you plan your journey?`,
        role: 'assistant',
      });
    }

    const client = new Anthropic({ apiKey });

    // Prepare messages for Claude safely
    const history = Array.isArray(conversationHistory) ? conversationHistory : [];
    const messages = [
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : 'I apologize, I encountered an error.';

    return NextResponse.json({
      message: assistantMessage,
      role: 'assistant',
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      message: `Gamarjoba! Welcome to Georgia. I can help recommend stays in Tbilisi, Batumi, Kazbegi, or Kakheti!`,
      role: 'assistant',
    });
  }
}
