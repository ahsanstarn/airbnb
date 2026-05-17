import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an AI travel planner for Kaya.ge — Georgia's travel marketplace. Create detailed, personalized Georgia travel itineraries based on the user's mood, interests, duration, and budget. Be specific: recommend actual towns, restaurants, activities, and estimated prices in GEL (₾). Keep it practical and actionable. Respond in markdown.`;

const smartPlanner = (mood: string, duration: string, budget: string): string => {
  const m = mood.toLowerCase();
  const d = parseInt(duration) || 3;
  const isLow = budget === 'low';
  const isMid = budget === 'mid' || budget === 'medium';
  const priceTag = isLow ? '₾40-80/night' : isMid ? '₾80-200/night' : '₾200-400/night';

  if (m.includes('wine') || m.includes('romance') || m.includes('food') || m.includes('culinary')) {
    return `## 🍷 A ${d}-Day Georgian Wine & Food Escape

### Best for: Kakheti wine country

**Day 1: Arrival in Tbilisi → Kakheti**
- Drive to Sighnaghi (2h), "City of Love"
- Walk the 4km fortress wall, 23 watchtowers
- Stay: ${isLow ? 'Guesthouse in Sighnaghi (₾65)' : isMid ? 'Kakheti Wine Estate (₾150/night)' : 'Kakheti Vineyard House (₾240/night)'}
- Dinner: Local family supra (₾${isLow ? '25' : isMid ? '40' : '70'} per person)

**Day 2: Wine Trail**
- Morning: Visit Tsinandali Estate & museum (₾15)
- Afternoon: Qvevri wine tasting at a family cellar (₾30)
- Evening: Cooking class — make khinkali & khachapuri (₾${isLow ? '50' : isMid ? '70' : '100'})

**Day 3: Return to Tbilisi**
- Morning: Telavi bazaar for local honey, churchkhela, spices
- Afternoon: Explore Tbilisi's Dezerter Bazaar food market
- Evening: Dinner at Khinkalnia Restaurant (₾${isLow ? '20' : isMid ? '35' : '55'})

**Total estimated: ₾${isLow ? '200-300' : isMid ? '400-600' : '800-1,200'}** 💰

Ready to book? Check stays in Sighnaghi and Telavi on Kaya.ge!`;
  }

  if (m.includes('adventure') || m.includes('hike') || m.includes('mountain') || m.includes('nature')) {
    return `## 🏔️ A ${d}-Day Georgian Mountain Adventure

### Best for: Kazbegi & Gudauri

**Day 1: Tbilisi → Kazbegi (Stepantsminda)**
- Drive the Georgian Military Highway (3h)
- Stop: Ananuri Fortress & Jinvali Reservoir (photos!)
- Stop: Gudauri Friendship Viewpoint (2,390m)
- Stay: ${isLow ? 'Kazbegi Mountain Lodge (₾120)' : isMid ? 'Mountain View Cabin (₾190)' : 'Kazbegi Ridge Cabin (₾420/night)'}

**Day 2: The Big Hike**
- 5am: Sunrise hike to Gergeti Trinity Church (3h round trip)
- Afternoon: Horseback riding in the valley (₾${isLow ? '40' : '70'} for 2h)
- Evening: Khinkali dinner with mountain views

**${d >= 3 ? `Day 3: Juta Valley or Truso Valley\n- Guided day hike to stunning alpine valleys (₾${isLow ? '50' : '80'})\n- Picnic lunch by the river\n- Return to Tbilisi or extend in Gudauri for skiing` : 'Return to Tbilisi after breakfast'}

**Total estimated: ₾${isLow ? '250-400' : isMid ? '500-800' : '900-1,500'}** 💰

Ready to go? Browse Kazbegi cabins on Kaya.ge!`;
  }

  if (m.includes('culture') || m.includes('history') || m.includes('city') || m.includes('explore')) {
    return `## 🏛️ A ${d}-Day Georgian Culture & City Explorer

### Best for: Tbilisi & Mtskheta

**Day 1: Old Tbilisi Walking Tour**
- Holy Trinity Cathedral (Sameba)
- Wander the curling streets of the Old Town
- Ride the cable car to Narikala Fortress (₾2.5)
- Sulfur bath district (Abanotubani)
- Stay: ${isLow ? 'Old Town Guesthouse (₾65)' : isMid ? 'Boutique Rustaveli (₾195)' : 'Panoramic Suite Vera (₾280/night)'}
- Dinner: Traditional Georgian restaurant (₾${isLow ? '25' : isMid ? '45' : '75'})

**Day 2: Mtskheta Day Trip (30 min from Tbilisi)**
- Jvari Monastery (UNESCO, 6th century)
- Svetitskhoveli Cathedral (UNESCO, 11th century)
- Local market for handmade crafts
- Evening: Wine bar crawl in Tbilisi's Vera district

**${d >= 3 ? `Day 3: Museum & Modern Art Day\n- Georgian National Museum (₾7)\n- Museum of Soviet Occupation (₾5)\n- Fabrika — hipster courtyard with shops & cafés\n- Farewell dinner at a Funicular restaurant with city views` : ''}

**Total estimated: ₾${isLow ? '150-250' : isMid ? '300-500' : '600-900'}** 💰

Book your Tbilisi stay on Kaya.ge!`;
  }

  return `## 🗺️ A ${d}-Day Georgia Sampler

### Best for: First-time visitors

**Day 1: Tbilisi**
- Hit the highlights: Old Town, Narikala Fortress, Sulfur Baths
- Dinner at a traditional supra restaurant
- Stay: ${isLow ? 'Cozy Tbilisi Apartment (₾80)' : isMid ? 'Rustaveli Boutique Hotel (₾160)' : 'Panoramic Suite Vera (₾280/night)'}

**Day 2: Day Trip**
- Option A: Kakheti wine region (wine tasting + Sighnaghi)
- Option B: Kazbegi mountains (Gergeti Church hike)
- Both are 2-3h from Tbilisi

**${d >= 3 ? `Day 3: Choose Your Adventure\n- Relax in Tbilisi: sulfur baths + shopping\n- More wine in Kakheti (stay overnight)\n- Head to Batumi for the Black Sea (5h train)` : ''}

**Total estimated: ₾${isLow ? '200-350' : isMid ? '400-650' : '700-1,200'}** 💰

Find your perfect stay on Kaya.ge!`;
};

export async function POST(req: NextRequest) {
  try {
    const { mood, duration, budget } = await req.json();
    if (!mood || !duration) {
      return NextResponse.json({ error: 'Mood and duration required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const prompt = `${SYSTEM_PROMPT}\n\nCreate a ${duration}-day itinerary for a traveler who feels: "${mood}". Budget level: ${budget || 'mid'}. Return a markdown itinerary with specific places, activities, and prices in GEL.`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return NextResponse.json({ itinerary: text });
      }
    }

    return NextResponse.json({ itinerary: smartPlanner(mood, duration, budget || 'mid') });
  } catch {
    return NextResponse.json({ itinerary: smartPlanner('explore', '3', 'mid') });
  }
}
