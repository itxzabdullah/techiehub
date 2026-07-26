import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY ?? "",
});

export async function POST(req: Request) {
    try {
        const { interests } = await req.json();

        if (!interests?.trim()) {
            return NextResponse.json(
                { error: "Please provide your interests." },
                { status: 400 }
            );
        }

        const { data: events, error } = await supabase
            .from("events")
            .select("*")
            .gte("event_date", new Date().toISOString())
            .order("event_date", { ascending: true });

        if (error || !events) {
            return NextResponse.json(
                { error: "Failed to load events." },
                { status: 500 }
            );
        }

        const prompt = `
You are TechieHub AI.

The user likes:

${interests}

Here are all available events:

${JSON.stringify(events)}

Return ONLY valid JSON.

Example:

{
  "recommendations":[
    {
      "id":1,
      "reason":"Matches AI and startup interests."
    }
  ]
}

Rules:

- Recommend at most 3 events.
- Use ONLY ids from the provided list.
- No markdown.
- No explanations.
- Only JSON.
`;


        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        const text = response.text;

        if (!text) {
            return NextResponse.json(
                { error: "AI returned an empty response." },
                { status: 500 }
            );
        }

        let parsed;

        try {
            parsed = JSON.parse(text);
        } catch {
            return NextResponse.json(
                { error: "AI returned invalid JSON." },
                { status: 500 }
            );
        }

        const recommendations =
            (parsed.recommendations ?? [])
                .map((rec: any) => {
                    const event = events.find((e: any) => e.id === rec.id);

                    if (!event) return null;

                    return {
                        event,
                        reason: rec.reason,
                    };
                })
                .filter(Boolean);
        if (recommendations.length === 0) {
            return NextResponse.json({
                recommendations: [],
                message: "No matching events found.",
            });
        }
        return NextResponse.json({
            recommendations,
        });
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Failed to generate recommendations." },
            { status: 500 }
        );
    }
}