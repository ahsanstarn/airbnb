import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

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
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Prepare messages for Claude
    const messages = [
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
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
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
