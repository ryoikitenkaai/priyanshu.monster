import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_MODELS_URL =
  "https://models.inference.ai.azure.com/chat/completions";

const SYSTEM_PROMPT = `You are a word pair generator for a party game called "Word Imposter."
Your job is to generate pairs of closely related but distinct words/phrases.
Rules:
- Both words must belong to the same general category (body parts, food, tools, places, animals, clothing, etc.)
- They must be similar enough that players can't immediately tell which word the imposter has
- They must be different enough that an observant player can eventually spot the imposter
- Use everyday, well-known words only
- Great examples: fork/spoon, ankle/wrist, cinnamon/nutmeg, parrot/macaw, kayak/canoe, freckle/mole, curtain/blinds
- Bad examples (too different): cat/airplane, salt/bicycle
Return ONLY valid JSON in this exact format, no markdown, no explanation:
{"normalWord":"word1","imposterWord":"word2","category":"category name","hint":"one short sentence describing the category without naming the words"}`;

export async function GET() {
  const apiKey = process.env.GITHUB_TOKEN;

  if (!apiKey) {
    console.warn("GITHUB_TOKEN not configured, using fallback pairs");
    return NextResponse.json(getFallbackPair());
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
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content:
              "Generate a fresh word pair for the Word Imposter game. Be creative and pick from a random category.",
          },
        ],
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 200,
        response_format: { type: "json_object" },
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("API error:", err);
      return NextResponse.json(getFallbackPair());
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse JSON:", content);
      return NextResponse.json(getFallbackPair());
    }

    // Validate required fields and ensure they are not empty strings
    if (!parsed.normalWord?.trim() || !parsed.imposterWord?.trim() || !parsed.category?.trim()) {
      return NextResponse.json(getFallbackPair());
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Error calling API:", err);
    return NextResponse.json(getFallbackPair());
  }
}

function getFallbackPair() {
  const fallbacks = [
    {
      normalWord: "Eyelashes",
      imposterWord: "Eyebrows",
      category: "Facial Features",
      hint: "Small features found on the human face",
    },
    {
      normalWord: "Fork",
      imposterWord: "Spoon",
      category: "Cutlery",
      hint: "Utensils used for eating",
    },
    {
      normalWord: "Ankle",
      imposterWord: "Wrist",
      category: "Body Joints",
      hint: "Joints that connect limbs to extremities",
    },
    {
      normalWord: "Cinnamon",
      imposterWord: "Nutmeg",
      category: "Spices",
      hint: "Common cooking spices with warm flavors",
    },
    {
      normalWord: "Kayak",
      imposterWord: "Canoe",
      category: "Watercraft",
      hint: "Small human-powered boats",
    },
    {
      normalWord: "Freckle",
      imposterWord: "Mole",
      category: "Skin Marks",
      hint: "Small natural marks on the skin",
    },
    {
      normalWord: "Curtain",
      imposterWord: "Blinds",
      category: "Window Coverings",
      hint: "Things that cover windows",
    },
    {
      normalWord: "Alligator",
      imposterWord: "Crocodile",
      category: "Reptiles",
      hint: "Large reptiles that live near water",
    },
    {
      normalWord: "Guitar",
      imposterWord: "Ukulele",
      category: "Musical Instruments",
      hint: "Stringed instruments with a fretted fingerboard",
    },
    {
      normalWord: "Bicycle",
      imposterWord: "Motorcycle",
      category: "Two-wheeled Vehicles",
      hint: "Vehicles with exactly two wheels",
    },
    {
      normalWord: "Muffin",
      imposterWord: "Cupcake",
      category: "Baked Goods",
      hint: "Small, individual-sized baked treats",
    },
    {
      normalWord: "Rabbit",
      imposterWord: "Hare",
      category: "Mammals",
      hint: "Small mammals with long ears",
    },
    {
      normalWord: "Tornado",
      imposterWord: "Hurricane",
      category: "Natural Disasters",
      hint: "Violent rotational wind storms",
    },
    {
      normalWord: "Socks",
      imposterWord: "Stockings",
      category: "Footwear",
      hint: "Garments worn directly on the feet",
    },
    {
      normalWord: "Jam",
      imposterWord: "Jelly",
      category: "Fruit Preserves",
      hint: "Sweet fruit spreads for bread",
    },
    {
      normalWord: "Glasses",
      imposterWord: "Contacts",
      category: "Vision Aids",
      hint: "Devices worn to improve eyesight",
    }
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
