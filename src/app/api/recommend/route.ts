import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // --------------------------------------------------
    // 1. Check Gemini API key
    // --------------------------------------------------

    const apiKey = process.env.GEMINI_API_KEY;

    console.log(
      "GEMINI_API_KEY configured:",
      Boolean(apiKey)
    );

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return NextResponse.json(
        {
          error: "Gemini API key is not configured.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    // --------------------------------------------------
    // 2. Read request
    // --------------------------------------------------

    const body = await req.json();
    const interests = body?.interests;

    if (
      typeof interests !== "string" ||
      !interests.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please provide your interests.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 3. Get upcoming events
    // --------------------------------------------------

    const supabase = await createClient();

    const {
      data: events,
      error: eventsError,
    } = await supabase
      .from("events")
      .select("*")
      .gte(
        "event_date",
        new Date().toISOString()
      )
      .order("event_date", {
        ascending: true,
      });

    if (eventsError) {
      console.error(
        "SUPABASE ERROR:",
        eventsError
      );

      return NextResponse.json(
        {
          error: "Failed to load events.",
          details: eventsError.message,
        },
        { status: 500 }
      );
    }

    if (!events || events.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message:
          "There are currently no upcoming events.",
      });
    }

    // --------------------------------------------------
    // 4. Send only useful event information to Gemini
    // --------------------------------------------------

    const eventData = events.map((event: any) => ({
      id: String(event.id),
      title: event.title,
      description: event.description,
      category: event.category,
      location: event.location,
      event_date: event.event_date,
      tags: event.tags,
    }));

    // --------------------------------------------------
    // 5. Build prompt
    // --------------------------------------------------

    const prompt = `
You are Techie Hub AI, an event recommendation assistant.

The user is interested in:

${interests}

Here are the upcoming events available on Techie Hub:

${JSON.stringify(eventData)}

Recommend up to 3 events that best match the user's interests.

Rules:
- Only recommend events from the provided list.
- Use the exact event id from the provided list.
- Recommend at most 3 events.
- Give a short and useful reason for every recommendation.
- If none of the events are relevant, return an empty recommendations array.
`;

    // --------------------------------------------------
    // 6. Ask Gemini for structured JSON
    // --------------------------------------------------

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            recommendations: {
              type: Type.ARRAY,

              items: {
                type: Type.OBJECT,

                properties: {
                  id: {
                    type: Type.STRING,
                  },

                  reason: {
                    type: Type.STRING,
                  },
                },

                required: [
                  "id",
                  "reason",
                ],
              },
            },
          },

          required: [
            "recommendations",
          ],
        },
      },
    });

    // --------------------------------------------------
    // 7. Get Gemini response
    // --------------------------------------------------

    const text = response.text;

    console.log(
      "GEMINI RESPONSE:",
      text
    );

    if (!text) {
      return NextResponse.json(
        {
          error:
            "AI returned an empty response.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // 8. Parse JSON
    // --------------------------------------------------

    let parsed: {
      recommendations?: {
        id: string;
        reason: string;
      }[];
    };

    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error(
        "GEMINI JSON PARSE ERROR:",
        parseError
      );

      console.error(
        "RAW GEMINI RESPONSE:",
        text
      );

      return NextResponse.json(
        {
          error:
            "AI returned invalid JSON.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // 9. Match Gemini recommendations
    //    with actual Supabase events
    // --------------------------------------------------

    const recommendations = (
      parsed.recommendations ?? []
    )
      .slice(0, 3)
      .map((recommendation) => {
        const event = events.find(
          (event: any) =>
            String(event.id) ===
            String(recommendation.id)
        );

        if (!event) {
          return null;
        }

        return {
          event,
          reason:
            recommendation.reason,
        };
      })
      .filter(
        (
          recommendation
        ): recommendation is {
          event: any;
          reason: string;
        } => recommendation !== null
      );

    // --------------------------------------------------
    // 10. No matches
    // --------------------------------------------------

    if (recommendations.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message:
          "No matching events found.",
      });
    }

    // --------------------------------------------------
    // 11. Return recommendations
    // --------------------------------------------------

    return NextResponse.json({
      recommendations,
    });
  } catch (err) {
    console.error(
      "RECOMMENDATION API ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to generate recommendations.",
      },
      { status: 500 }
    );
  }
}