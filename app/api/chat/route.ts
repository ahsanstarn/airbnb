import { NextRequest, NextResponse } from 'next/server';

// This route handles AI chat requests SERVER-SIDE
// The Anthropic API key is NEVER exposed to the client
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback demo response when no API key is configured
      return NextResponse.json({
        role: 'assistant',
        content: "I'm KLARA, your Georgia travel assistant! 🇬🇪 To enable full AI responses, the ANTHROPIC_API_KEY needs to be configured on the server. For now, I can tell you that Georgia is an amazing destination with stunning mountains, incredible wine, and the warmest hospitality you'll ever experience!",
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are KLARA, the AI travel assistant for Kaya.ge — Georgia's travel marketplace. You are knowledgeable, warm, and helpful. You know everything about Georgian tourism: hotels, restaurants, wine regions, hiking, culture, food, history, and practical travel tips. You respond in a friendly, concise way with emoji and formatting. When recommending places, mention prices in GEL (₾). Always suggest users check listings on Kaya.ge for bookings.`,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      role: 'assistant',
      content: data.content[0].text,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
