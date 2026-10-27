// © Konectr 2026. All rights reserved.
// API route: POST /api/venue-interview → creates row in Notion database

import { Client } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";

// The form is founder-only (~2 interviews a week), so 20 per IP per hour is generous (#257).
const allow = createRateLimiter(20, 60 * 60 * 1000);


// 500s never echo Postgres/Notion error text to the browser; the detail is logged server-side.
const GENERIC_500 = "Something went wrong. Please try again.";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_INTERVIEW_DATABASE_ID || "";

// Ensure new DB properties exist (idempotent — safe to call every time)
let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  try {
    await notion.databases.update({
      database_id: DATABASE_ID,
      properties: {
        "Slow Periods": { rich_text: {} },
      },
    });
  } catch {
    // Property may already exist or permissions insufficient — continue
  }
  schemaReady = true;
}

export async function POST(request: NextRequest) {
  if (!allow(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  if (!DATABASE_ID) {
    return NextResponse.json(
      { error: "Interview database not configured" },
      { status: 500 }
    );
  }

  try {
    await ensureSchema();
    const d = await request.json();

    // Build properties — only include fields that have values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: Record<string, any> = {};

    // Title (required)
    properties["Venue Name"] = {
      title: [{ text: { content: d.venueName || "Untitled" } }],
    };

    // Date
    if (d.interviewDate) {
      properties["Interview Date"] = { date: { start: d.interviewDate } };
    }

    // Select fields
    const selects: Record<string, string> = {
      "Venue Type": d.venueType,
      Neighborhood: d.neighborhood,
      Role: d.role,
      "Google Rating": d.googleRating,
      "Years Operating": d.yearsOperating,
      "Daily Foot Traffic": d.dailyFootTraffic,
      Demographic: d.demographic,
      "Monthly Marketing Spend": d.monthlyMarketingSpend,
      "Hosted Events Before": d.hostedEventsBefore,
      "Open to Meetups": d.openToMeetups,
      "Dashboard Interest": d.dashboardInterest,
      "WiFi + Group Seating": d.wifiGroupSeating,
      "Perk Willingness": d.perkWillingness,
      "Partner Interest": d.partnerInterest,
      "Vibe Check": d.vibeCheck,
      "Partner Tier": d.partnerTier,
      Enthusiasm: d.enthusiasm,
    };
    for (const [prop, val] of Object.entries(selects)) {
      if (val) properties[prop] = { select: { name: val } };
    }

    // Multi-select fields
    const multiSelects: Record<string, string[]> = {
      "Top Challenges": d.topChallenges || [],
      "Marketing Channels": d.marketingChannels || [],
      "Top Value Props": d.topValueProps || [],
    };
    for (const [prop, val] of Object.entries(multiSelects)) {
      if (val.length > 0) {
        properties[prop] = {
          multi_select: val.map((name: string) => ({ name })),
        };
      }
    }

    // Number fields
    const numbers: Record<string, { raw: string; divisor?: number }> = {
      "Seating Capacity": { raw: d.seatingCapacity },
      "Repeat %": { raw: d.repeatPercent, divisor: 100 },
      "Ambiance Score": { raw: d.ambianceScore },
    };
    for (const [prop, { raw, divisor }] of Object.entries(numbers)) {
      const num = parseFloat(raw);
      if (!isNaN(num)) {
        properties[prop] = { number: divisor ? num / divisor : num };
      }
    }

    // Rich text fields
    const richTexts: Record<string, string> = {
      "Person Interviewed": d.personInterviewed,
      "Key Quote": d.keyQuote,
      "Slow Periods": d.slowPeriods,
      Notes: d.notes,
    };
    for (const [prop, val] of Object.entries(richTexts)) {
      if (val) {
        properties[prop] = { rich_text: [{ text: { content: val } }] };
      }
    }

    // Phone fields
    const phones: Record<string, string> = {
      Contact: d.contact,
      "Follow-Up Phone": d.followUpPhone,
    };
    for (const [prop, val] of Object.entries(phones)) {
      if (val) properties[prop] = { phone_number: val };
    }

    // Email
    if (d.followUpEmail) {
      properties["Follow-Up Email"] = { email: d.followUpEmail };
    }

    // URL
    if (d.instagram) {
      properties["Instagram"] = { url: d.instagram };
    }

    const page = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties,
    });

    return NextResponse.json({ success: true, id: page.id });
  } catch (err: unknown) {
    console.error("Notion API error:", err);
    return NextResponse.json({ error: GENERIC_500 }, { status: 500 });
  }
}
