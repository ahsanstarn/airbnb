import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are KLARA, the AI travel assistant for Kaya.ge — Georgia's travel marketplace. You are knowledgeable, warm, and helpful. You know everything about Georgian tourism: hotels, restaurants, wine regions, hiking, culture, food, history, and practical travel tips. You respond in a friendly, concise way. When recommending places, mention prices in GEL (₾). Always suggest users check listings on Kaya.ge for bookings. Keep responses under 200 words.`;

const smartReplies = (msg: string): string => {
  const lower = msg.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hi there! I'm KLARA, your Georgia travel assistant. I can help you find the perfect stay, suggest destinations, or answer questions about traveling in Georgia. What are you looking for?";
  }

  if (lower.includes('thank')) {
    return "You're very welcome! If you have more questions about traveling in Georgia, finding the perfect stay, or planning your itinerary, I'm here to help. Just ask!";
  }

  if (lower.includes('tbilisi')) {
    return "Tbilisi is Georgia's vibrant capital! Here are some top stays:\n\n🏨 **Panoramic Suite Vera** — ₾280/night — Luxury suite in the trendy Vera district with city views\n🏨 **Old Town Guesthouse** — ₾65/night — Authentic Georgian experience in a 200-year-old house\n🏨 **Boutique Rustaveli** — ₾195/night — Central location on Rustaveli Avenue\n\nWould you like more details on any of these?";
  }

  if (lower.includes('batumi')) {
    return "Batumi is Georgia's Black Sea gem! Top picks:\n\n🌊 **Modern Seaside Flat** — ₾95/night — Cozy apartment steps from the beach\n🌊 **Black Sea Resort** — ₾180/night — Full-service resort with pool and spa\n🌊 **Villa on the Hillside** — ₾220/night — Private villa with sea views and garden\n\nPerfect for a summer getaway! Would you like to know more?";
  }

  if (lower.includes('kazbegi') || lower.includes('mountain') || lower.includes('hike')) {
    return "Kazbegi (Stepantsminda) is a paradise for mountain lovers! Check these:\n\n🏔️ **Kazbegi Mountain Lodge** — ₾120/night — Cozy cabin with Kazbek views\n🏔️ **Kazbegi Ridge Cabin** — ₾420/night — Luxury mountain retreat with hot tub\n🏔️ **Cottage in Gudauri** — ₾110/night — Perfect for ski season, near the slopes\n\nThe Gergeti Trinity Church hike is a must-do! Want me to suggest an itinerary?";
  }

  if (lower.includes('kakheti') || lower.includes('wine')) {
    return "Kakheti is Georgia's wine country! Must-visit stays:\n\n🍷 **Kakheti Wine Estate** — ₾150/night — Stay in a working vineyard with wine tastings\n🍷 **Kakheti Vineyard House** — ₾240/night — Traditional house surrounded by vines\n\nDon't miss the underground qvevri wine cellars and the Sighnaghi walled town! Would you like help planning a wine tour?";
  }

  if (lower.includes('price') || lower.includes('cost') || lower.includes('gel') || lower.includes('budget')) {
    return "Here are typical price ranges across Georgia:\n\n💵 **Budget** (₾40-80/night) — Guesthouses and hostels\n💵 **Mid-range** (₾80-200/night) — Hotels and apartments\n💵 **Luxury** (₾200-450/night) — Boutique hotels and villas\n\nMost properties on Kaya.ge include breakfast and WiFi. What's your budget?";
  }

  if (lower.includes('guesthouse') || lower.includes('guest house')) {
    return "Guesthouses are the heart of Georgian hospitality! Here's what to expect:\n\n🏠 Home-cooked meals (khachapuri, khinkali, etc.) included\n🏠 Hosts who speak English and Georgian\n🏠 Cultural experiences like cooking classes or wine tastings\n🏠 Average price: ₾55-80/night\n\nOur top pick: **Old Town Guesthouse** in Tbilisi (₾65/night) — 4.85 rating! Would you like to see it?";
  }

  if (lower.includes('apartment') || lower.includes('flat')) {
    return "Apartments are great for independent travelers! Best options:\n\n🏢 **Modern Seaside Flat** — Batumi, ₾95/night\n🏢 **Cozy Tbilisi Apartment** — ₾80/night\n🏢 **Boutique Rustaveli** — Tbilisi, ₾195/night\n\nAll come with WiFi, kitchen access, and flexible check-in. Interested in any?";
  }

  if (lower.includes('hotel')) {
    return "Hotels in Georgia range from boutique to luxury:\n\n⭐ **Panoramic Suite Vera** — Tbilisi, ₾280/night — 4.96 rating\n⭐ **Boutique Rustaveli** — Tbilisi, ₾195/night — 4.91 rating\n⭐ **Black Sea Resort** — Batumi, ₾180/night — 4.69 rating\n\nAll are verified on Kaya.ge. Which one catches your eye?";
  }

  if (lower.includes('house') || lower.includes('home') || lower.includes('villa') || lower.includes('property')) {
    return "We have some beautiful properties across Georgia! Here are a few options:\n\n🏡 **Old Town Courtyard** — Tbilisi, ₾65/night — A charming guesthouse in the heart of the Old Town, with a private courtyard and homemade breakfast included.\n\n🏡 **Kakheti Vineyard House** — Signagi, ₾240/night — A traditional Georgian house surrounded by vineyards, with wine tasting and mountain views.\n\n🏡 **Batumi Sea View Loft** — Batumi, ₾210/night — Modern loft with panoramic Black Sea views, fully equipped kitchen, and rooftop terrace.\n\n🏡 **Kazbegi Ridge Cabin** — Stepantsminda, ₾420/night — Luxury mountain cabin with fireplace, hot tub, and direct views of Mount Kazbek.\n\nWhich one interests you?";
  }

  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('eat') || lower.includes('khinkali') || lower.includes('khachapuri')) {
    return "Georgian food is incredible! Here are must-try dishes and where to find them:\n\n🥟 **Khinkali** (dumplings) — Try at Khinkalnia in Tbilisi (~₾1 each)\n🧀 **Khachapuri** (cheese bread) — The Adjarian style from Batumi is famous\n🍷 **Qvevri wine** — 8,000 years of winemaking tradition\n🍢 **Mtsvadi** (BBQ) — Best at outdoor restaurants in Kakheti\n\nWant restaurant recommendations in a specific city?";
  }

  return "That's a great question! Georgia has so much to offer. I can help with:\n\n🏨 **Finding stays** — Hotels, apartments, guesthouses, cabins, resorts, villas\n📍 **Destinations** — Tbilisi, Batumi, Kazbegi, Kakheti, Svaneti, and more\n🍷 **Food & wine** — Restaurant recommendations and wine tours\n💰 **Pricing** — Budget-friendly to luxury options\n🗺️ **Trip planning** — Itineraries and local tips\n\nWhat would you like to explore?";
};

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nKLARA:` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ role: 'assistant', content: text });
        }
      } else {
        const errText = await response.text();
        if (errText.includes('429') || errText.includes('quota')) {
          console.log('Gemini quota exceeded, using smart replies');
        }
      }
    }

    return NextResponse.json({ role: 'assistant', content: smartReplies(message) });
  } catch (error) {
    console.error('KLARA error:', error);
    return NextResponse.json({ role: 'assistant', content: smartReplies('') });
  }
}
