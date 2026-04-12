import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_MODELS_URL =
  "https://models.inference.ai.azure.com/chat/completions";

const getSystemPrompt = (playedWords: string[]) => `You are a word pair generator for a party game called "Word Imposter."
Your job is to generate pairs of related but distinct words/phrases.

Rules:
1. The two words should share a broad category but be functionally DIFFERENT to increase fun.
2. DO NOT make them too similar (e.g., eyelash/eyelid or kayak/canoe is BAD because the imposter can easily guess).
3. The imposter word should be a slightly off-topic variation to throw them off. 
   - Good Examples: Laptop / Typewriter, Coffee / Hot Sauce, Guitar / Drum Set, Helicopter / Parachute.
4. Use everyday, well-known words only.
5. STRICT AVOIDANCE: You absolutely MUST NOT generate any of the following previously played words OR their synonyms. 
   Played Words to Avoid: [${playedWords.length > 0 ? playedWords.join(", ") : "none"}]

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{"normalWord":"word1","imposterWord":"word2","category":"category name","hint":"one short sentence describing the category without naming the words"}`;

export async function POST(request: Request) {
  let playedWords: string[] = [];
  try {
    const body = await request.json();
    if (Array.isArray(body.playedWords)) {
      playedWords = body.playedWords;
    }
  } catch (e) {}

  const apiKey = process.env.GITHUB_TOKEN;

  if (!apiKey) {
    console.warn("GITHUB_TOKEN not configured, using fallback pairs");
    return NextResponse.json(getFallbackPair(playedWords));
  }

  try {
    const response = await fetch(GITHUB_MODELS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: getSystemPrompt(playedWords),
          },
          {
            role: "user",
            content:
              "Generate a fresh word pair for the Word Imposter game. Be creative and pick from a random category.",
          },
        ],
        temperature: 0.9,
        top_p: 0.9,
        max_tokens: 200,
        response_format: { type: "json_object" },
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("API error:", err);
      return NextResponse.json(getFallbackPair(playedWords));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse JSON:", content);
      return NextResponse.json(getFallbackPair(playedWords));
    }

    // Validate required fields and ensure they are not empty strings
    if (!parsed.normalWord?.trim() || !parsed.imposterWord?.trim() || !parsed.category?.trim()) {
      return NextResponse.json(getFallbackPair(playedWords));
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Error calling API:", err);
    return NextResponse.json(getFallbackPair(playedWords));
  }
}

function getFallbackPair(playedWords: string[] = []) {
  const fallbacks = [
    {
      normalWord: "Coffee",
      imposterWord: "Hot Sauce",
      category: "Consumable Liquids",
      hint: "Something bold and stimulating to drink or eat",
    },
    {
      normalWord: "Laptop",
      imposterWord: "Typewriter",
      category: "Writing Tools",
      hint: "Devices with a keyboard for making text",
    },
    {
      normalWord: "Bicycle",
      imposterWord: "Unicycle",
      category: "Wheeled Transport",
      hint: "Vehicles without an engine that use pedals",
    },
    {
      normalWord: "Guitar",
      imposterWord: "Drum Set",
      category: "Musical Instruments",
      hint: "Equipment used to create rhythm or melody",
    },
    {
      normalWord: "Sword",
      imposterWord: "Shield",
      category: "Medieval Armament",
      hint: "Tools used by knights in battle",
    },
    {
      normalWord: "Helicopter",
      imposterWord: "Parachute",
      category: "Aerial Equipment",
      hint: "Things used to navigate through the sky",
    },
    {
      normalWord: "Microwave",
      imposterWord: "Toaster",
      category: "Kitchen Appliances",
      hint: "Small machines that heat up food quickly",
    },
    {
      normalWord: "Submarine",
      imposterWord: "Hot Air Balloon",
      category: "Vehicles",
      hint: "Things that go up or down to transport people",
    },
    {
      normalWord: "Oven",
      imposterWord: "Campfire",
      category: "Cooking Methods",
      hint: "Ways to cook food with high heat",
    },
    {
      normalWord: "Television",
      imposterWord: "Projector",
      category: "Display Devices",
      hint: "Machines used to watch movies and shows",
    },
    {
      normalWord: "Ice Cream",
      imposterWord: "Popsicle",
      category: "Frozen Desserts",
      hint: "Sweet treats served very cold",
    },
    {
      normalWord: "Elevator",
      imposterWord: "Escalator",
      category: "Building Transport",
      hint: "Mechanisms to avoid taking the stairs",
    },
    {
      normalWord: "Refrigerator",
      imposterWord: "Cooler",
      category: "Cold Storage",
      hint: "Containers meant to keep items chilled",
    },
    {
      normalWord: "Backpack",
      imposterWord: "Suitcase",
      category: "Storage Bags",
      hint: "Things used to carry items while traveling",
    }
  ];

  const availableFallbacks = fallbacks.filter(
    (f) => !playedWords.includes(f.normalWord) && !playedWords.includes(f.imposterWord)
  );

  const pool = availableFallbacks.length > 0 ? availableFallbacks : fallbacks;
  return pool[Math.floor(Math.random() * pool.length)];
}
