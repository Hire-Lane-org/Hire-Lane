import { NextRequest, NextResponse } from "next/server";
import { extractJobDetails } from "@/lib/parser/jobExtractor";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Job description text is required" }, { status: 400 });
    }

    // 1. Run deterministic parser first
    const extracted = extractJobDetails(text);

    // 2. If OPENAI_API_KEY is configured, optionally enrich with LLM
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
                content:
                  "You are a job description parser. Extract JSON with keys: companyName, role, location, jobType (Full-time, Internship, Contract, Part-time), experienceLevel (Fresher, 0-1 years, 1-3 years, 3-5 years, 5+ years), jobPostingLink, applicationSource. Only include keys where you are confident.",
              },
              {
                role: "user",
                content: text.slice(0, 3000),
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const parsed = JSON.parse(aiData.choices?.[0]?.message?.content || "{}");
          // Merge AI fields without overwriting confidently parsed fields
          Object.assign(extracted, {
            companyName: extracted.companyName || parsed.companyName,
            role: extracted.role || parsed.role,
            location: extracted.location || parsed.location,
            jobType: extracted.jobType || parsed.jobType,
            experienceLevel: extracted.experienceLevel || parsed.experienceLevel,
            jobPostingLink: extracted.jobPostingLink || parsed.jobPostingLink,
            applicationSource: extracted.applicationSource || parsed.applicationSource,
          });
        }
      } catch (err) {
        console.warn("[Smart Extraction AI Fallback] Falling back to deterministic parser:", err);
      }
    }

    return NextResponse.json({ success: true, data: extracted });
  } catch (error: any) {
    console.error("[Job Extraction API Error]", error);
    return NextResponse.json({ error: error.message || "Failed to extract job details" }, { status: 500 });
  }
}
